const expertModel = require("../../models/xpertModel");

const expertController = {
  registerExpertByAdmin: async (req, res) => {
    try {
      let profileImage;

      if (req.file) {
        profileImage = req.file.location;
      } else if (req.body.profileImage && req.body.profileImage.location) {
        profileImage = req.body.profileImage.location;
      }

      console.log("---F-->", req.file);

      const { firstName, lastName, email, mobileNumber, gender, dateOfBirth } =
        req.body;

      const existingUser = await expertModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "Email already exists",
        });
      }

      const expertDetail = await expertModel.create({
        profileImage,
        firstName,
        lastName,
        email,
        mobileNumber,
        gender,
        dateOfBirth,
      });

      return res.status(201).json({
        status: true,
        message: "Expert created successfully",
        data: expertDetail,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        Err: error.message,
      });
    }
  },

  getExpertController: async (req, res) => {
    try {
      const id = req.query.id;
      const categoryName = req.query.category;
      const subCategoryName = req.query.subCategory;

      let query = {};

      if (id) {
        query = { _id: id };
      }

      console.log("Query:", JSON.stringify(query));

      const expertData = await expertModel
        .find(query)
        .populate({
          path: "categories",
          select: "_id iconImage categoryName cirtificateName description",
          model: "Category",
        })
        .populate({
          path: "subCategories",
          select: "_id iconImage subCategoryName cirtificateName description",
          model: "SubCategory",
        })
        .exec();

      // Filter expertData based on categoryName
      const filteredByCategory = categoryName
        ? expertData.filter((item) =>
            item.categories.some((category) =>
              new RegExp(categoryName, "i").test(category.categoryName)
            )
          )
        : expertData;

      // Filter expertData based on subCategoryName
      const filteredBySubCategory = subCategoryName
        ? filteredByCategory.filter((item) =>
            item.subCategories.some((subCategory) =>
              new RegExp(subCategoryName, "i").test(subCategory.subCategoryName)
            )
          )
        : filteredByCategory;

      const expertCount = await expertModel.countDocuments(query);

      if (!expertData || expertData.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Expert not found",
        });
      }

      let responseObj = {
        status: true,
        message: "Expert found successfully",
        data: filteredBySubCategory,
      };

      if (!categoryName && !subCategoryName) {
        responseObj.count = expertCount;
      }

      res.status(200).json(responseObj);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  // enrollXpert: async (req, res) => {
  //   try {
  //     const id = req.params.id;
  //     const expert = await expertModel.findById(id);

  //     if (!expert) {
  //       return res.status(404).json({
  //         status: false,
  //         message: "Expert not found, please sign up first.",
  //       });
  //     }

  //     let categoryCertificates;
  //     let subCategoryCertificates;

  //     if (req.files) {
  //       // Handle multiple category certificates
  //       if (req.files.categoryCertificates) {
  //         categoryCertificates = req.files.categoryCertificates.map((file) => ({
  //           file: file.location,
  //           status: "pending",
  //         }));
  //       }

  //       // Handle multiple sub-category certificates
  //       if (req.files.subCategoryCertificates) {
  //         subCategoryCertificates = req.files.subCategoryCertificates.map(
  //           (file) => ({ file: file.location, status: "pending" })
  //         );
  //       }
  //     } else {
  //       // Handle single category certificate
  //       if (req.body.categoryCertificates) {
  //         categoryCertificates = [
  //           { file: req.body.categoryCertificates, status: "pending" },
  //         ];
  //       }

  //       // Handle single sub-category certificate
  //       if (req.body.subCategoryCertificates) {
  //         subCategoryCertificates = [
  //           { file: req.body.subCategoryCertificates, status: "pending" },
  //         ];
  //       }
  //     }

  //     const {
  //       categories,
  //       subCategories,
  //       categoryRegNumber,
  //       subCategoryRegNumber,
  //       awardRecognition,
  //       degreeCertification,
  //       aadharNumber,
  //       panNumber,
  //       experience,
  //       city,
  //       qualification,
  //       aumRange,
  //     } = req.body;

  //     const payload = {
  //       categories,
  //       subCategories,
  //       categoryCertificates,
  //       subCategoryCertificates,
  //       categoryRegNumber,
  //       subCategoryRegNumber,
  //       awardRecognition,
  //       degreeCertification,
  //       aadharNumber,
  //       panNumber,
  //       experience,
  //       city,
  //       qualification,
  //       aumRange,
  //     };

  //     const updatedExpert = await expertModel.findByIdAndUpdate(id, payload, {
  //       new: true,
  //     });

  //     if (updatedExpert) {
  //       return res.status(200).json({
  //         status: true,
  //         message: "Expert profile updated successfully",
  //         data: updatedExpert,
  //       });
  //     }

  //     return res.status(400).json({
  //       status: false,
  //       message: "Failed to update expert profile.",
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       status: false,
  //       error: error.message,
  //     });
  //   }
  // },

  updateExpert: async (req, res) => {
    try {
      const expertId = req.params.id;
      let expert = await expertModel.findById({ _id: expertId });
      console.log("--->>>>", expert);

      if (!expert) {
        return res.status(404).json({
          status: false,
          message: "Expert not found",
        });
      } else {
        let categoryCertificates = expert.categoryCertificates || [];
        let subCategoryCertificates = expert.subCategoryCertificates || [];

        if (req.files) {
          if (req.files.categoryCertificates) {
            const newCategoryCertificates = req.files.categoryCertificates.map(
              (file) => ({
                file: file.location,
                status: "pending",
              })
            );
            categoryCertificates = [
              ...categoryCertificates,
              ...newCategoryCertificates,
            ];
          }

          if (req.files.subCategoryCertificates) {
            const newSubCategoryCertificates =
              req.files.subCategoryCertificates.map((file) => ({
                file: file.location,
                status: "pending",
              }));
            subCategoryCertificates = [
              ...subCategoryCertificates,
              ...newSubCategoryCertificates,
            ];
          }
        } else {
          if (req.body.categoryCertificates) {
            const newCategoryCertificate = {
              file: req.body.categoryCertificates,
              status: "pending",
            };
            categoryCertificates = [
              ...categoryCertificates,
              newCategoryCertificate,
            ];
          }

          if (req.body.subCategoryCertificates) {
            const newSubCategoryCertificate = {
              file: req.body.subCategoryCertificates,
              status: "pending",
            };
            subCategoryCertificates = [
              ...subCategoryCertificates,
              newSubCategoryCertificate,
            ];
          }
        }

        let profileImage;

        if (req.files && req.files.profileImage) {
          // Handle profile image upload
          profileImage = req.files.profileImage[0].location;
        } else if (req.body.profileImage && req.body.profileImage.location) {
          // Use the existing profile image location
          profileImage = req.body.profileImage.location;
        }

        const {
          firstName,
          lastName,
          email,
          mobileNumber,
          gender,
          dateOfBirth,
          xpertStatus,
          categories,
          subCategories,
          categoryRegNumber,
          subCategoryRegNumber,
          awardRecognition,
          degreeCertification,
          aadharNumber,
          panNumber,
          experience,
          city,
          qualification,
          aumRange,
        } = req.body;

        const payload = {
          profileImage,
          firstName,
          lastName,
          email,
          mobileNumber,
          gender,
          dateOfBirth,
          xpertStatus,
          categories,
          subCategories,
          categoryCertificates,
          subCategoryCertificates,
          categoryRegNumber,
          subCategoryRegNumber,
          awardRecognition,
          degreeCertification,
          aadharNumber,
          panNumber,
          experience,
          city,
          qualification,
          aumRange,
        };

        let updatedExpert = await expertModel.findByIdAndUpdate(
          expertId,
          payload,
          {
            new: true,
          }
        );

        if (!updatedExpert) {
          return res.status(400).json({
            status: false,
            message: "Expert not updated, got an error.",
          });
        }

        // Certificate Approval Logic
        const {
          categoryCertificateIndex,
          subCategoryCertificateIndex,
          status,
        } = req.body;

        // Update category certificate status
        if (categoryCertificateIndex !== undefined) {
          if (
            updatedExpert.categoryCertificates &&
            updatedExpert.categoryCertificates[categoryCertificateIndex]
          ) {
            updatedExpert.categoryCertificates[
              categoryCertificateIndex
            ].status = status;
          } else {
            return res
              .status(404)
              .json({ message: "Category certificate not found" });
          }
        }

        // Update sub-category certificate status
        if (subCategoryCertificateIndex !== undefined) {
          if (
            updatedExpert.subCategoryCertificates &&
            updatedExpert.subCategoryCertificates[subCategoryCertificateIndex]
          ) {
            updatedExpert.subCategoryCertificates[
              subCategoryCertificateIndex
            ].status = status;
          } else {
            return res
              .status(404)
              .json({ message: "Sub-category certificate not found" });
          }
        }

        await updatedExpert.save();

        return res.status(200).json({
          status: true,
          message: "Expert updated successfully",
          data: updatedExpert,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        err: error.message,
      });
    }
  },

  uploadDocs: async (req, res) => {
    try {
      const id = req.params.id;
      let expert = await expertModel.findOne({ _id: id });

      if (expert) {
        if (req.file) {
          const imageLocation = req.file.location;
          const fileName = req.body.fileName || "";

          if (req.body.imageType === "identityProof") {
            expert.identityProofImages.push({ file: imageLocation, fileName });
          } else if (req.body.imageType === "qualificationProof") {
            expert.qualificationProofImages.push({
              file: imageLocation,
              fileName,
            });
          } else {
            return res.status(400).json({ message: "Invalid image type" });
          }

          const data = await expert.save();

          return res.status(200).json({
            status: true,
            message: "Image uploaded successfully",
            data: data,
          });
        } else {
          return res.status(400).json({ message: "No file provided" });
        }
      } else {
        return res.status(404).json({ message: "Expert not found" });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        err: error.message,
      });
    }
  },

  // certificateApproval: async (req, res) => {
  //   try {
  //     const id = req.params.id;
  //     const expert = await expertModel.findById(id);

  //     if (!expert) {
  //       return res.status(404).json({
  //         status: false,
  //         message: "Expert not found.",
  //       });
  //     }

  //     const { categoryCertificateIndex, subCategoryCertificateIndex, status } =
  //       req.body;

  //     // Update category certificate status
  //     if (categoryCertificateIndex !== undefined) {
  //       if (
  //         expert.categoryCertificates &&
  //         expert.categoryCertificates[categoryCertificateIndex]
  //       ) {
  //         expert.categoryCertificates[categoryCertificateIndex].status = status;
  //       } else {
  //         return res
  //           .status(404)
  //           .json({ message: "Category certificate not found" });
  //       }
  //     }

  //     // Update sub-category certificate status
  //     if (subCategoryCertificateIndex !== undefined) {
  //       if (
  //         expert.subCategoryCertificates &&
  //         expert.subCategoryCertificates[subCategoryCertificateIndex]
  //       ) {
  //         expert.subCategoryCertificates[subCategoryCertificateIndex].status =
  //           status;
  //       } else {
  //         return res
  //           .status(404)
  //           .json({ message: "Sub-category certificate not found" });
  //       }
  //     }

  //     await expert.save();

  //     return res.status(200).json({
  //       status: true,
  //       message: "Certificate status updated successfully",
  //       data: expert,
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       status: false,
  //       error: error.message,
  //     });
  //   }
  // },

  deleteExpert: async (req, res) => {
    try {
      const { id } = req.params;

      if (id) {
        const deleteXpert = await expertModel.findByIdAndDelete(id);
        if (!deleteXpert) {
          return res.status(400).json({
            status: false,
            message: "Expert not deleted...",
          });
        }
        return res.status(200).json({
          status: true,
          message: "Expert successfully deleted...",
          data: deleteXpert,
        });
      }

      return res.status(404).json({
        status: false,
        message: "Expert not found...",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        err: error.message,
      });
    }
  },
};

module.exports = expertController;
