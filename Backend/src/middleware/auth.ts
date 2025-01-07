import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';
import { User } from 'db/models/user';
import jwt from 'jsonwebtoken';
import axios from 'axios';

dotenv.config();

const audience = process.env.AUTH0_AUDIENCE;
const issuer = process.env.AUTH0_ISSUER;

if (!audience || !issuer) {
  throw new Error('Please make sure that AUTH0_AUDIENCE and AUTH0_ISSUER are in the environment');
}

const checkAuth0 = auth({
  audience: audience,
  issuerBaseURL: issuer,
  tokenSigningAlg: 'RS256'
});


const handleJwtError = (err, req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  let message;
  let decodedPayload;
  let expired = false;
  let expiresAt = null;

  if (token) {
    try {
      decodedPayload = jwt.decode(token);
      if (decodedPayload && decodedPayload.exp) {
        expiresAt = new Date(decodedPayload.exp * 1000);
        expired = new Date() >= expiresAt;
        if (expired) {
          message = "Auth0: expired token";
        }
      }
    } catch (decodeError) {
      decodedPayload = decodeError;
    }
  } else {
    message = "Auth Error: missing Authorization Header";
  }

  res.status(500).json({
    message: message,
    authorizationHeader: token,
    decodedJwtPayload: decodedPayload,
    expired: expired,
    expiresAt: expiresAt,
    error: err,
  });
};

async function getUserFromPayload(payload) {
  const auth0Id = payload.sub;
  const auth0Email = payload.email;
  const requesterUser = await User.findOne({ where: { auth0Id: auth0Id } }) as User | null;
  if (requesterUser) {
    if (auth0Email && requesterUser.email !== auth0Email) {
      await requesterUser.update({ email: auth0Email });
      console.log("User id:", requesterUser.id, "email:", requesterUser.email, "has been updated");
    }
    return requesterUser;
  }

  // Auth0 user does not exist in the database
  if (!auth0Email) {
    throw new Error('JWT payload does not contain email');
  }

  const pendingUser = await User.findOne({
    where: {
      email: auth0Email,
      auth0Id: null
    }
  }) as User | null;
  if (pendingUser) { // User exists in the database but has not been linked to Auth0
    await pendingUser.update({ auth0Id: auth0Id });
    console.log("User id:", pendingUser.id, "email:", pendingUser.email, "has been linked to Auth0");
    return pendingUser;
  }

  const newUser = await User.create({
    email: auth0Email,
    auth0Id: auth0Id,
    username: auth0Email,
  });
  return newUser;
}

export async function accessTokenAuth0() {
  const options = {
    method: 'POST',
    url: `${process.env.AUTH0_ISSUER}oauth/token`,
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'Accept-Encoding': 'gzip, deflate' },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: `${process.env.AUTH0_M2M_CLIENT_ID}`,
      client_secret: `${process.env.AUTH0_M2M_CLIENT_SECRET}`,
      audience: `${process.env.AUTH0_ISSUER}api/v2/`
    })
  };
  const response = await axios.request(options);
  return response.data.access_token;
}

export async function getAuth0Users(token: string) {
  return await axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.AUTH0_ISSUER}api/v2/users`,
    headers: {
      'authorization': `Bearer ${token}`,
      'Accept-Encoding': 'gzip, deflate',
    },
  });
}

export const syncWithAuth0 = async () => {
  if (process.env.AUTH0_M2M_CLIENT_ID && process.env.AUTH0_M2M_CLIENT_SECRET) {
    try {
      console.log("Syncing with Auth0...");
      const token = await accessTokenAuth0();
      const response = await getAuth0Users(token);
      for (const user of response.data) {
        await getUserFromPayload({
          sub: user.user_id,
          email: user.email
        });
      }
    } catch (error) {
      console.log("Error syncing with Auth0: ", error);
    }
  } else {
    console.log("Unable to sync with Auth0: Missing M2M credentials");
  }
};

// Middleware to check if user exists in the database and create if not
const checkJwt = async (req, res, next) => {
  try {
    await checkAuth0(req, res, async (err) => {
      if (err) {
        return handleJwtError(err, req, res);
      }
      req.requesterUser = await getUserFromPayload(req.auth.payload);
      next();
    });
  } catch (error) {
    next(error);
  }
};

export default checkJwt;