import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.interface";

const userSchema: Schema = new Schema({
    name: String,
    email:String,
    password: String,
  });

const User = mongoose.model<IUser>('User', userSchema);
export default User;
