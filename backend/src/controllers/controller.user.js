import { User } from "../models/model.user";
import { comparePassword, hashPassword } from "../utils/bcrypt";

export const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    [username, email, password].some((field) => !field || field.trim() === "")
  ) {
    console.log("All fields are required");
  }

  const hash = await hashPassword(password);

  if (!hash) {
    console.error("unabale to hash password");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    console.log("User already exists");
  } else {
    console.log("User not found");
  }

  const user = User.create({
    username,
    password: hash,
    email,
  });

  user.save();

  res.json({
    status: 201,
    message: "User create successfully",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.params;

  if ([email, password].some((e) => !e || e.trim === "")) {
    throw new Error("invalid creds");
  }

  const user = User.findOne({
    email,
  });

  if (!user) {
    throw new Error("user not found");
  }

  const isPassword = comparePassword(password, user.password);

  if (!isPassword) {
    throw new Error("Invalid creds");
  }

  res.json({
    data: {
      accessToken: "asfjasljfdlas",
    },
    message: "logged In",
    status: 200,
  });
};
