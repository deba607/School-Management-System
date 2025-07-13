const express = require('express');
const TeacherauthController = require('../controllers/teacher-auth-controller');
const { validate } = require('../middlewares/validate-middileware');
const { signupSchema } = require('../validators/teacher-auth-validator');
const router = express.Router();



router.route("/").get(TeacherauthController.home);

router.route("/register").post( validate (signupSchema), TeacherauthController.register);
router.route("/login").post(TeacherauthController.login);


// Read all
router.route("/profile").get(TeacherauthController.getProfiles);
// Read one
router.route("/profile/:id").get(TeacherauthController.getProfileById);
// Read one by email
router.route("/profile/email/:email").get(TeacherauthController.getProfileByEmail);
// Update
router.route("/profile/:id").put(TeacherauthController.updateProfile);
// Delete
router.route("/profile/:id").delete(TeacherauthController.deleteProfile);

module.exports = router;