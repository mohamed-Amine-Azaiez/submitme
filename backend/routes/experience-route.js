const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const experienceConttroller = require("../controllers/experience-controller");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();

router.get("/", experienceConttroller.getExperiences);
router.get("/:id", experienceConttroller.getExperienceById);

router.use(checkAuth);
router.post(
  "/",
  [check("experience").not().isEmpty()],
  experienceConttroller.createExperience
);

router.patch(
  "/:id",
  fileUpload.single("image"),
  experienceConttroller.updateExperience
);

router.delete("/:id", experienceConttroller.deleteExperience);
module.exports = router;
