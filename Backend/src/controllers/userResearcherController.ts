import { UserResearcher } from "db/models/userResearcher";
import { User } from "db/models/user";
import { Researcher } from "db/models/researcher";

async function getResearchersInfo(data) {
    const result = [];
  
    for (const entry of data) {
      const researcher = await Researcher.findOne({
        where: {
          id: entry.researcher_id
        }
      });
  
      if (researcher) {
        result.push({
          researcher: researcher,
          tutorRol: entry.tutorRol
        });
      }
    }
  
    return result;
}

async function getUsersInfo(data) {
    const result = [];
  
    for (const entry of data) {
      const user = await User.findOne({
        where: {
          id: entry.user_id
        }
      });
  
      if (user) {
        result.push({
          user: user,
          tutorRol: entry.tutorRol
        });
      }
    }
  
    return result;
}


export const createUserResearcher = async (req, res) => {
  try {

    const userResearcherData = req.body;
    const user_email = userResearcherData.user_email;
    const researcher_email = userResearcherData.researcher_email;
    const tutorRol = userResearcherData.tutorRol;

    const user = await User.findOne({
        where: {
            email: user_email
        }
    });

    const researcher = await Researcher.findOne({
        where: {
            email: researcher_email
        }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!researcher) {
      return res.status(404).json({ message: "Researcher not found" });
    }

    if (!tutorRol) {
      return res.status(400).json({ message: "Tutor role is required" });
    }

    const userResearcher = await UserResearcher.findOne({
        where: {
            user_id: user.id,
            researcher_id: researcher.id,
            tutorRol: tutorRol
        }
    });

    if (userResearcher) {
        return res.status(400).json({ message: "User researcher already exists" });
    }

    const newResearcher = await UserResearcher.create({
        user_id: user.id,
        researcher_id: researcher.id,
        tutorRol: tutorRol
    });

    return res.status(201).json(newResearcher);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating researcher" });
  }
};

export const getAllUserResearchers = async (req, res) => {
    try {
        const userResearchers = await UserResearcher.findAll();
        return res.status(200).json(userResearchers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting all user researchers" });
    }
};

export const getResearchersOfUser = async (req, res) => {
    try {
        const userEmail = req.params.email;

        const user = await User.findOne({
            where: {
                email: userEmail
            }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userResearchers = await UserResearcher.findAll({
            where: {
                user_id: user.id
            }
        });

        const researchersData = await getResearchersInfo(userResearchers);

        return res.status(200).json(researchersData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting researchers by user email" });
    }
}

export const getUsersOfResearcher = async (req, res) => {
    try {
        const researcherEmail = req.params.email;

        const researcher = await Researcher.findOne({
            where: {
                email: researcherEmail
            }
        })

        if (!researcher) {
            return res.status(404).json({ message: "Researcher not found" });
        }

        const userResearchers = await UserResearcher.findAll({
            where: {
                researcher_id: researcher.id
            }
        });

        const usersData = await getUsersInfo(userResearchers);
        
        return res.status(200).json(usersData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error getting users by researcher email" });
    }
}

export const deleteUserResearcher = async (req, res) => {
    try {
        const userResearcherData = req.body;
        const user_email = userResearcherData.user_email;
        const researcher_email = userResearcherData.researcher_email;
        const tutorRol = userResearcherData.tutorRol;

        const user = await User.findOne({
            where: {
                email: user_email
            }
        });

        const researcher = await Researcher.findOne({
            where: {
                email: researcher_email
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!researcher) {
            return res.status(404).json({ message: "Researcher not found" });
        }

        if (!tutorRol) {
            return res.status(400).json({ message: "Tutor role is required" });
        }

        const userResearcher = await UserResearcher.findOne({
            where: {
                user_id: user.id,
                researcher_id: researcher.id,
                tutorRol: tutorRol
            }
        });

        if (!userResearcher) {
            return res.status(404).json({ message: "User researcher not found" });
        }

        await UserResearcher.destroy({
            where: {
                user_id: user.id,
                researcher_id: researcher.id,
                tutorRol: tutorRol
            }
        });

        return res.status(200).json({ message: "User researcher deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting user researcher" });
    }
}

export default {
    createUserResearcher,
    getResearchersOfUser,
    getUsersOfResearcher,
    getAllUserResearchers,
    deleteUserResearcher
}