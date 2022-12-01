const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const userController = require("../controllers/user-controller");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/login", userController.login);
router.post(
  "/",
  [
    check("name").not().isEmpty(),
    check("password").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
  ],
  userController.createUser
);
router.use(checkAuth);

router.patch(
  "/:id",
  fileUpload.single("profileImage"),
  userController.updateUser
);
router.patch(
  "/editpass/:id",
  [
    check("currentPassword").not().isEmpty(),
    check("newPassword").not().isEmpty(),
    check("newPassword").isLength({ min: 6 }),
  ],
  userController.updatepass
);

module.exports = router;
