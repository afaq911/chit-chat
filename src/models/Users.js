import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    profilepic: { type: "string", required: false },
    username: { type: "string", required: true },
    email: { type: "string", required: true },
    password: { type: "string", required: true },
  },
  { timestamps: true }
);

const Users = mongoose.models.Users || mongoose.model("Users", UserSchema);
export default Users;
