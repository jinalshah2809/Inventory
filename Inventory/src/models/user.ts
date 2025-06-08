import { Schema, model } from "mongoose";
import { hashPassword } from "../helpers/helper";

const userSchema = new Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, sparse: true, trim: true },
    password: { type: String, required: true, minlength: 8 }, // Hashed password
  },
  { timestamps: true }
);

const User = model("User", userSchema);

// ✅ Seed dummy super admin if not exists
(async () => {
  try {
    const existing = await User.findOne({ username: "superadmin" }); // 🔹 Fixed improper model reference

    if (!existing) {
      await User.create({
        first_name: "Super",
        last_name: "Admin",
        username: "superadmin",
        password: await hashPassword("SuperAdmin@123"),
      });

      console.log("✅ Super admin user created.");
    } else {
      console.log("ℹ️ Super admin already exists.");
    }
  } catch (error) {
    console.error("❌ Error creating super admin:", error);
  }
})();

export default User;
