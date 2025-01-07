import { Request, Response } from 'express';
import { ApplicationPeriod } from "../db/models/applicationPeriod";
import { FundingRequest } from "../db/models/fundingRequest";
import { Research } from "../db/models/research";
import { Scholarship } from "../db/models/scholarship";
import { Thesis } from "../db/models/thesis";
import { User } from "../db/models/user";
import { UserResearch } from "../db/models/userResearch";
import { Researcher } from "../db/models/researcher";
import { UserResearcher } from "../db/models/userResearcher";
import { File } from "../db/models/file";
import { FundingRequestFiles } from "../db/models/fundingRequestFiles";
import { ScholarshipFiles } from "../db/models/scholarshipFiles";
import { seedDatabase } from 'db/seed';
import axios from 'axios';
import { accessTokenAuth0, getAuth0Users } from 'middleware/auth';
import { FundingBudget } from 'db/models/fundingBudget';
import { UserAnnouncement } from 'db/models/userAnnouncement';
import { Announcement } from 'db/models/announcement';

async function deleteAuth0User(id, token) {
  await axios.request({
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${process.env.AUTH0_ISSUER}api/v2/users/${id}`,
    headers: { 
      'authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', 
      'Accept': 'application/json'
    },
  })
  .then(function (response) {
    console.log("User deleted in Auth0 \n");
    console.log(JSON.stringify(response.data));
    console.log("\n \n");
  })
  .catch(function (error) {
    console.log("Error creating user in Auth0 \n");
    console.error(error);
  });
}

export const resetDb = async (_req: Request, res: Response) => {
  try{
    await UserResearcher.destroy({ where: {} });
    await UserResearch.destroy({ where: {} });
    await FundingRequestFiles.destroy({ where: {} });
    await ScholarshipFiles.destroy({ where: {} });
    await FundingRequest.destroy({ where: {} });
    await Scholarship.destroy({ where: {} });
    await ApplicationPeriod.destroy({ where: {} });
    await Research.destroy({ where: {} });
    await Thesis.destroy({ where: {} });
    await Researcher.destroy({ where: {} });
    await Announcement.destroy({ where: {} });
    await UserAnnouncement.destroy({ where: {} });
    await User.destroy({ where: {} });
    await File.destroy({ where: {} });
    await FundingBudget.destroy({ where: {} });

    await seedDatabase();

    const token = await accessTokenAuth0();
    const response = await getAuth0Users(token);
    for(const user of response.data){
      const dbuser = await User.findOne({ where: { email: user.email } });
      if(!dbuser){
        console.log("Deleting user from Auth0: ", user.email);
        await deleteAuth0User(user.user_id, token);
      }
    }

    res.status(200).json({ message: 'Database reset' });
  }catch(error){
    res.status(500).json({ message: 'Error resetting database', error: error });
  }
};

export default {
  resetDb,
};