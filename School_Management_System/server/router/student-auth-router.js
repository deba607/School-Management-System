const express = require('express');
const StudentauthController = require('../controllers/student-auth-controller');
const { validate } = require('../middlewares/validate-middileware');
const { signSchema } = require('../validators/student-auth-validator');
const router = express.Router();



router.route("/").get(StudentauthController.home);

router.route("/register").post( validate (signSchema), StudentauthController.register);
router.route("/login").post(StudentauthController.login);
// Read all
router.route("/profile").get(StudentauthController.getProfiles);
// Read one
router.route("/profile/:id").get(StudentauthController.getProfileById);
// Read one by email
router.route("/profile/email/:email").get(StudentauthController.getProfileByEmail);
// Update
router.route("/profile/:id").put(StudentauthController.updateProfile);
// Delete
router.route("/profile/:id").delete(StudentauthController.deleteProfile);

module.exports = router;