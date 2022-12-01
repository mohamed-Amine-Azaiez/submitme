const HttpError = require("../models/http-error");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};
const getUserById = async (req, res, next) => {
  const userId = req.params.id;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }
  res.json({
    user: user.toObject({ getters: true }),
  });
};

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("An unknown error occurred!", 500));
  }
  const { name, password, email } = req.body;
  let image = "";
  if (req.file && !!req.file.path) {
    image = req.file.path;
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later..",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedpassword;
  try {
    hashedpassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Creating user failed, please try again1.",
      500
    );
    return next(error);
  }

  let createdUser = new User({
    name,
    password: hashedpassword,
    email,
    profileImage: image,
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(err.message, 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Loggin in failed, please try again later1.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Could not log you in, please try again.", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid password, please try again.", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "amine_key_jwt",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Could not log you in, please try again.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(/* "An unknown error occurred!" */ errors.message, 500)
    );
  }

  const userId = req.params.id;

  let upuser;
  try {
    upuser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later",
      500
    );
    return next(error);
  }
  if (!upuser) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  const { name, email } = req.body;

  if (name) upuser.name = name;

  if (email) upuser.email = email;
  if (req.file && !!req.file.path) {
    upuser.profileImage = req.file.path;
  }
  try {
    await upuser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Updating user failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ user: upuser });
};

const updatepass = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("An unknown error occurred!", 500));
  }

  const userId = req.params.id;

  let upuser;
  try {
    upuser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later",
      500
    );
    return next(error);
  }
  if (!upuser) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }
  const { currentPassword, newPassword } = req.body;

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(currentPassword, upuser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not change the passwor, please try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Current password is invalid, please try again.",
      401
    );
    return next(error);
  }

  let hashedpassword;
  try {
    hashedpassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError(
      "updating password failed, please try again.",
      500
    );
    return next(error);
  }
  upuser.password = hashedpassword;
  try {
    await upuser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("updating user failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ message: "Password changed successfully." });
};

exports.updatepass = updatepass;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.login = login;
