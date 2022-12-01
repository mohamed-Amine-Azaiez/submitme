const HttpError = require("../models/http-error");
const Experience = require("../models/experience");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const getExperiences = async (req, res, next) => {
  let experiences;
  try {
    experiences = await Experience.find();
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching experiences failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    experiences: experiences.map((ex) => ex.toObject({ getters: true })),
  });
};

const getExperienceById = async (req, res, next) => {
  const experienceID = req.params.id;
  let experience;
  try {
    experience = await Experience.findById(experienceID);
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching experience failed, please try again later",
      500
    );
    return next(error);
  }

  if (!experience) {
    const error = new HttpError(
      "Could not find an experience with the provided ID",
      404
    );
    return next(error);
  }
  res.json({ experience: experience.toObject({ getters: true }) });
};

const createExperience = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new HttpError(
      errors.message || "An unknown error occurred!!",
      500
    );
    return next(err);
  }

  const { user, experience } = req.body;

  let createdExperience = new Experience({ user, experience });
  try {
    await createdExperience.save();
  } catch (err) {
    const error = new HttpError(
      err.message || "Creating exprience failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({ experience: createdExperience });
};

const updateExperience = async (req, res, next) => {
  const experienceID = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      errors.message || "An unknown error occurred!",
      500
    );
    return next(error);
  }
  let existingExperience;
  try {
    existingExperience = await Experience.findById(experienceID);
  } catch (err) {
    const error = new HttpError(
      err.message || "Fetching experience failed, please try again later",
      500
    );
    return next(error);
  }
  if (!existingExperience) {
    return next(
      new HttpError("Could not find experience with the provided Id", 404)
    );
  }

  const { experience } = req.body;
  if (experience) {
    existingExperience.experience = experience;
  }

  try {
    await existingExperience.save();
  } catch (err) {
    const error = new HttpError(
      err.message || "Updating experience failed, please try again later",
      500
    );
    return next(error);
  }
  res.status(201).json({ updated: existingExperience });
};
const deleteExperience = async (req, res, next) => {
  const experienceID = req.params.id;
  let experience;
  try {
    experience = await Experience.findById(experienceID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete experience.",
      500
    );
    return next(error);
  }

  if (!experience) {
    const error = new HttpError("Could not find experience for this id.", 404);
    return next(error);
  }

  try {
    await experience.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete experience.",
      500
    );
  }
  res.status(200).json({ message: "Experience Deleted." });
};

exports.deleteExperience = deleteExperience;
exports.getExperiences = getExperiences;
exports.getExperienceById = getExperienceById;
exports.createExperience = createExperience;
exports.updateExperience = updateExperience;
