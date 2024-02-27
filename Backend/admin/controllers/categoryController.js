const { Category, SubCategory } = require("../../models/categoryModel");

const categoryController = {
   // ^ Category Controller
  createCategory: async (req, res) => {
    try {

      let iconImage;

    if (req.file) {
      iconImage = req.file.location;
    } else {
      iconImage = req.body.iconImage.location;
    }

    console.log("---F-->", req.file)

      const { categoryName, cirtificateName, description } = req.body;
      const category = await Category.create({
        iconImage,
        categoryName,
        cirtificateName,
        description,
      });

      if (category) {             
        res.status(201).json({
          status: true,
          message: "Category created successfuly.",
          data: category,
        });
      } else {
        res.status(400).json({
          status: false,
          message: "Category not created, got error.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: `Error: ${error.message}.`,
      });
    }
  },


  updateCategory: async (req, res) => {
    try {
      const id = req.params.id;

      let check = await Category.findOne({ _id: id });

      if (!check) {
        res.status(400).json({
          status: false,
          message: "Category not found with this id.",
        });
      } else {
        let iconImage;

    if (req.file) {
      iconImage = req.file.location;
    } else {
      iconImage = req.body.iconImage;
    }
        const payload = {
          iconImage,
          categoryName: req.body.categoryName,
          cirtificateName: req.body.cirtificateName,
          description: req.body.description,
        };

        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          payload,
          { new: true }
        );

        if (updatedCategory) {
          res.status(200).json({
            status: true,
            message: "Category updated successfuly.",
            data: updatedCategory,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Category not updated.",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: `Error: ${error.message}.`,
      });
    }
  },

  getCategory: async (req, res) => {
    try {
      const id = req.params.id;

      if (id) {
        const data = await Category.findOne({ _id: id });
        if (data) {
          res.status(200).json({  
            status: true,
            message: "Category data found successfully.",
            data: data,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Category data not found with this id.",
          });
        }
      } else {
        const data = await Category.find();

        if (data && data.length > 0) {
          res.status(200).json({
            status: true,
            message: "Categories data found successfully.",
            data: data,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Categories data not found, there is no data.",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: `Error: ${error.message}.`,
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Category ID is required for deletion.",
        });
      }

      const deletedCategory = await Category.findByIdAndDelete(id);

      if (deletedCategory) {
        res.status(200).json({
          status: true,
          message: "Category deleted successfully.",
          //   data: deletedCategory
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Category not found or not deleted.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: `Error: ${error.message}.`,
      });
    }
  },


// ^ Sub Category Controller ----------------------------------------------
createSubCategory: async (req, res) => {
  try {

    let iconImage;

  if (req.file) {
    iconImage = req.file.location;
  } else {
    iconImage = req.body.iconImage;
  }

    const { subCategoryName, cirtificateName, description } = req.body;
    const subCategory = await SubCategory.create({
      iconImage,
      subCategoryName,
      cirtificateName,
      description,
    });

    if (subCategory) {             
      res.status(201).json({
        status: true,
        message: "Sub Category created successfuly.",
        data: subCategory,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Sub Category not created, got error.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error: ${error.message}.`,
    });
  }
},

updateSubCategory: async (req, res) => {
  try {
    const id = req.params.id;

    let check = await SubCategory.findOne({ _id: id });

    if (!check) {
      res.status(400).json({
        status: false,
        message: "Sub Category not found with this id.",
      });
    } else {
      let iconImage;

  if (req.file) {
    iconImage = req.file.location;
  } else {
    iconImage = req.body.iconImage;
  }
      const payload = {
        iconImage,
        subCategoryName: req.body.subCategoryName,
        cirtificateName: req.body.cirtificateName,
        description: req.body.description,
      };

      const updatedSubCategory = await SubCategory.findByIdAndUpdate(
        id,
        payload,
        { new: true }
      );

      if (updatedSubCategory) {
        res.status(200).json({
          status: true,
          message: "Sub Category updated successfuly.",
          data: updatedSubCategory,
        });
      } else {
        res.status(400).json({
          status: false,
          message: "Sub Category not updated.",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error: ${error.message}.`,
    });
  }
},

getSubCategory: async (req, res) => {
  try {
    const id = req.params.id;

    if (id) {
      const data = await SubCategory.findOne({ _id: id });
      if (data) {
        res.status(200).json({  
          status: true,
          message: "Sub Category data found successfully.",
          data: data,
        });
      } else {
        res.status(400).json({
          status: false,
          message: "Sub Category data not found with this id.",
        });
      }
    } else {
      const data = await SubCategory.find();

      if (data && data.length > 0) {
        res.status(200).json({
          status: true,
          message: "Sub Categories data found successfully.",
          data: data,
        });
      } else {
        res.status(400).json({
          status: false,
          message: "Sub Categories data not found, there is no data.",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Error: ${error.message}.`,
    });
  }
},

  deleteSubCategory: async (req, res) => {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Sub Category ID is required for deletion.",
        });
      }

      const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

      if (deletedSubCategory) {
        res.status(200).json({
          status: true,
          message: "Sub Category deleted successfully.",
          //   data: deletedCategory
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Sub Category not found or not deleted.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: `Error: ${error.message}.`,
      });
    }
  },

};

module.exports = categoryController;
