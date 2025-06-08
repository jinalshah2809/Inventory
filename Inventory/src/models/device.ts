import { Schema, model, Types } from "mongoose";
import { nintyDays } from "../helpers/cron";

const deviceSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    deviceId: { type: String, required: true },     // Unique device identifier
    appId: { type: String, required: true },         // App ID like com.example.app
    name: { type: String, required: true },          // Device name e.g., iPhone
    model: { type: String, required: true },         // Device model
    platform: { type: String, required: true },      // OS platform
    version: { type: String, required: true },       // OS version
    ipAddress: { type: String, required: true },
    latitude: { type: Schema.Types.Decimal128, required: true },
    longitude: { type: Schema.Types.Decimal128, required: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Types.ObjectId, ref: "User" },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    deletedBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Automatically delete after 90 days
nintyDays(model("device", deviceSchema));

const Device = model("device", deviceSchema);
export default Device;
