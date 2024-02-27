const TeamMember = require("../../models/teamMemberModel");

const teamController = {
  addMember: async (req, res) => {
    try {
      let profileImage;

      if (req.file) {
        profileImage = req.file.location;
      } else if (req.body.profileImage && req.body.profileImage.location) {
        profileImage = req.body.profileImage.location;
      }

      const createdBy = req.user;

      const {
        fullName,
        dateOfRegistration,
        mobileNumber,
        role,
        email,
        gender,
        dateOfBirth,
        designation,
      } = req.body;

      let check = await TeamMember.findOne({
        $or: [{ email }, { mobileNumber }],
      });

      if (check) {
        return res.status(409).json({
          status: false,
          message: "Team member already exist with this email or mobileNumber.",
        });
      }

      const newMember = await TeamMember.create({
        profileImage,
        fullName,
        dateOfRegistration,
        mobileNumber,
        role,
        email,
        gender,
        dateOfBirth,
        designation,
        createdBy: createdBy.id,
      });

      if (!newMember) {
        return res.status(400).json({
          status: false,
          message: "Team member not added, got an error while add member.",
        });
      }

      return res.status(201).json({
        status: true,
        message: "Team member added successfully.",
        data: newMember,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went Wrong.",
        Error: error.message,
      });
    }
  },

  getMember: async (req, res) => {
    try {
      const { id } = req.params;

      if (id) {
        const teamMember = await TeamMember.findById(id);

        if (!teamMember) {
          return res.status(404).json({
            status: false,
            message: "Team member not found.",
          });
        }

        return res.status(200).json({
          status: true,
          message: "Get team member successfully.",
          data: teamMember,
        });
      }

      const members = await TeamMember.find();

      if (!members) {
        return res.status(404).json({
          status: false,
          message: "Team members not found.",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Get team members successfully.",
        data: members,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went Wrong.",
        Error: error.message,
      });
    }
  },

  updateMember: async (req, res) => {
    try {
      const { id } = req.params;

      let profileImage;

      if (req.file) {
        profileImage = req.file.location;
      } else if (req.body.profileImage && req.body.profileImage.location) {
        profileImage = req.body.profileImage.location;
      }

      const createdBy = req.user;

      const {
        fullName,
        dateOfRegistration,
        mobileNumber,
        role,
        email,
        gender,
        dateOfBirth,
        status,
        designation,
      } = req.body;

      const existingMember = await TeamMember.findOne({
        $and: [{ _id: { $ne: id } }, { $or: [{ email }, { mobileNumber }] }],
      });

      if (existingMember) {
        return res.status(409).json({
          status: false,
          message:
            "Team member already exists with this email or mobile number.",
        });
      }

      const payload = {
        profileImage,
        fullName,
        dateOfRegistration,
        mobileNumber,
        role,
        email,
        gender,
        dateOfBirth,
        status,
        designation,
        createdBy: createdBy.id,
      };

      const updatedMember = await TeamMember.findByIdAndUpdate(id, payload, {
        new: true,
      });

      if (!updatedMember) {
        return res.status(400).json({
          status: false,
          message: "Team member not updated or not found.",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Team member updated successfully.",
        data: updatedMember,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went Wrong.",
        Error: error.message,
      });
    }
  },

  deleteMember: async (req, res) => {
    try {
      const { id } = req.params;

      if(id){
        const deleteMember = await TeamMember.findByIdAndDelete(id);

      if (!deleteMember) {
        return res.status(400).json({
          status: false,
          message: "Team Member not deleted...",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Team member delete Successfully.",
        data: deleteMember,
      });
      }
      return res.status(400).json({
        status: false,
        message: "Please provide id..."
      })
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went Wrong.",
        Error: error.message,
      });
    }
  },
};

module.exports = teamController;
