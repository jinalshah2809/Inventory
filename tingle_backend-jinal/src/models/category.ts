import mongoose, { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, required: true }, // Manual ObjectId assignment
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, maxlength: 300 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "category" } // ✅ lowercase collection name
);

const Category = model("category", categorySchema); // ✅ lowercase model name

// ✅ Seed Categories with Predefined ObjectIDs
const seedCategories = async () => {
  try {
    const existingCount = await Category.countDocuments();
    if (existingCount === 0) {
      const dummyCategories = [
        {
          _id: new mongoose.Types.ObjectId("60b6c6f5c8e4f91698fd00a1"),
          name: "Electronics",
          description: "Gadgets and devices",
        },
        {
          _id: new mongoose.Types.ObjectId("60b6c6f5c8e4f91698fd00a2"),
          name: "Clothing",
          description: "Apparel and accessories",
        },
        {
          _id: new mongoose.Types.ObjectId("60b6c6f5c8e4f91698fd00a3"),
          name: "Books",
          description: "Fiction and non-fiction literature",
        },
      ];

      await Category.insertMany(dummyCategories);
      console.log("✅ Dummy categories seeded successfully!");
    } else {
      console.log("ℹ️ Categories already exist, skipping seeding.");
    }
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  }
};

seedCategories();

export default Category;
