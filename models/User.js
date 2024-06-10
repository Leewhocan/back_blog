import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true, // обазательное свойство
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    AvatarUrl: String, // если хотим сказать что не уникально указываем сразу String
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
