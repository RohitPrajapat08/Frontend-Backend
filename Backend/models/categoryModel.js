const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const categorySchema = new Schema(
  {
    iconImage: { type: String },
    categoryName: { type: String, trim: true },
    cirtificateName: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const subCategorySchema = new Schema(
  {
    iconImage: { type: String },
    subCategoryName: { type: String, trim: true },
    cirtificateName: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = {
  Category,
  SubCategory,
};
