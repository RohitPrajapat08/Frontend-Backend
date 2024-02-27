const questionModel = require("../../models/questionModel");

const questionController = {
  createQuestion: async (req, res) => {
    try {
      const adminId = req.user.id;
      console.log("---Admin--->", adminId);
      const { questionType, question, options } = req.body;

      let newQuestion = new questionModel({
        questionType,
        question,
        options,
        adminId,
      });

      await newQuestion.save();

      res.status(201).json({
        status: true,
        message: "Question created successfully.",
        data: newQuestion,
      });
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  updateQuestion: async (req, res) => {
    try {
      const id = req.params.id;

      const existingQuestion = await questionModel.findById(id);

      if (!existingQuestion) {
        return res.status(404).json({
          status: false,
          message: "Question not found.",
        });
      }
      if (existingQuestion) {
        const payload = {
          questionType: req.body.questionType || existingQuestion.questionType,
          question: req.body.question || existingQuestion.question,
          options: req.body.options || existingQuestion.options,
          status: req.body.status || existingQuestion.status,
        };

        let updatedQuestion = await questionModel.findByIdAndUpdate(
          id,
          payload,
          { new: true }
        );
        if (updatedQuestion) {
          res.status(200).json({
            status: true,
            message: "Question updated successfully",
            data: updatedQuestion,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Question not updated.",
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "Question not found.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  getQuestion: async (req, res) => {
    try {
      const id = req.params.id;

      if (id) {
        const check = await questionModel.findOne({ _id: id });

        if (!check) {
          res.status(400).json({
            status: false,
            message: "Question not found with this id",
          });
        } else {
          res.status(200).json({
            status: true,
            message: "Question data found successfuly.",
            data: check,
          });
        }
      } else {
        const data = await questionModel.find();
        if (data.length > 0) {
          res.status(200).json({
            status: true,
            message: "Questions Data found successfully.",
            data: data,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Data not found.",
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  deleteQuestion: async (req, res) => {
    try {
      const id = req.params.id;
      if (id) {
        const deletedQuestion = await questionModel.findByIdAndDelete(id);

        if (deletedQuestion) {
          res.status(200).json({
            status: true,
            message: "Question deleted successfuly.",
            data: deletedQuestion,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Question not deleted.",
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "Question id required.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  // updateQuestionStatus: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const existingQuestion = await questionModel.findById(id);

  //     if (!existingQuestion) {
  //       return res.status(404).json({
  //         status: false,
  //         message: "Question not found.",
  //       });
  //     }

  //     const newStatus =
  //       existingQuestion.status === "active" ? "deactive" : "active";

  //     const updatedQuestion = await questionModel.findByIdAndUpdate(
  //       id,
  //       { $set: { status: newStatus } },
  //       { new: true }
  //     );

  //     const updatedStatusMessage =
  //       newStatus === "active" ? "activated" : "deactivated";

  //     res.status(200).json({
  //       status: true,
  //       message: `Question ${updatedStatusMessage} successfully.`,
  //       updatedQuestion: updatedQuestion,
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       status: false,
  //       message: "Something went wrong",
  //       error: error.message,
  //     });
  //   }
  // },
};

module.exports = questionController;
