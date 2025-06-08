import mongoose, { Schema, model } from "mongoose";
import Category from "./category";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "category", // ✅ Refers to lowercase "category"
        required: true,
      },
    ],
    createdBy: { type: Schema.Types.ObjectId },
    updatedBy: { type: Schema.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "product" } // ✅ lowercase collection name
);

const Product = model("product", productSchema); // ✅ lowercase model name

// ✅ Seed Dummy Products
const seedProducts = async () => {
  try {
    const existingCount = await Product.countDocuments();
    if (existingCount === 0) {
      const dummyProducts = [
        {
          name: "Smartphone",
          description: "Latest Android device with high-speed processing",
          quantity: 50,
          categories: [new mongoose.Types.ObjectId("60b6c6f5c8e4f91698fd00a1")],
        },
        {
          name: "T-Shirt",
          description: "Cotton fabric, comfortable to wear",
          quantity: 100,
          categories: [new mongoose.Types.ObjectId("60b6c6f5c8e4f91698fd00a2")],
        },
        {
          name: "Novel",
          description: "A thrilling mystery book",
          quantity: 30,
          categories: [new mongoose.Types.ObjectId("60b6c6f5c8e4f91698fd00a3")],
        },
      ];

      await Product.insertMany(dummyProducts);
      console.log("✅ Dummy products seeded successfully!");
    } else {
      console.log("ℹ️ Products already exist, skipping seeding.");
    }
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  }
};

seedProducts();

export default Product;
