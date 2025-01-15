import { Schema } from "mongoose";
import { hashPassword } from "../../utils/password.utils.js";
import mongoose from "mongoose";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.pre("save", function (next) {
  const user = this;

  // Validate email
  const emailRegex = /\S+@\S+\.\S+/;
  const isValidEmail = emailRegex.test(user.email);

  if (!isValidEmail) return next(new Error("Invalid email"));

  next();
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  // Hash the password
  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword;

  next();
});

export const userModel = mongoose.model("user", userSchema);