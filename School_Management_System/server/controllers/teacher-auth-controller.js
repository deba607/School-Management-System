const TeacherRegistration = require("../models/teacher-registration");
const bcrypt = require("bcryptjs");

// Registration Logic
const home = async (req, res)=> {
  try {
    res.status(202).send("This is the router code");
  } catch (error) {
    console.error(error);
  }
};

const register = async (req, res)=> {
  try {
    //console.log(req.body);
    const { name, email, phone, department, password, confirmPassword } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const userExist = await TeacherRegistration.findOne({email: normalizedEmail});

    if(userExist) return res.status(400).json ({message: "Email already exist"});
   

    const userCreated = await TeacherRegistration.create({ name, email, phone, department, password, confirmPassword });

    res.status(201).json({message: "Registration Successful", 
      token: await userCreated.generateToken(), 
      userId: userCreated._id.toString()});
  } catch (error) {
    res.status(400).json({message:"Error: Internal Server Error"});
  }
};




// Login Logic
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const userExist = await TeacherRegistration.findOne({email: normalizedEmail});

    if(!userExist) return res.status(600).json({message:"Invalid Credaintials"});

    //const user = await bcrypt.compare(password, userExist.password);

     // If you have a comparePassword method on your schema, use it:
     const isMatch = await userExist.comparePassword(password);

     // If you do NOT have a comparePassword method, use:
     // const isMatch = await bcrypt.compare(password, userExist.password);
 
     if (isMatch) {
       res.status(200).json({
         message: "Login Successful",
         token: await userExist.generateToken(),
         userId: userExist._id.toString()
       });
     } else {
       res.status(401).json({ message: "Invalid Email or Password" });
     }
   } catch (error) {
     res.status(500).json({ message: "Error: Internal Server Error" });
   }
}


// Get all profiles
const getProfiles = async (req, res) => {
    try {
      const profiles = await TeacherRegistration.find();
      res.json(profiles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


// Get profile by ID
const getProfileById = async (req, res) => {
    try {
      const profile = await TeacherRegistration.findById(req.params.id);
      if (!profile) return res.status(404).json({ error: 'Profile not found' });
      res.json(profile);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  // Get Profile by email
  const getProfileByEmail = async (req, res) => {
    try {
      const profile = await TeacherRegistration.findOne({ email: req.params.email });
      if (!profile) return res.status(404).json({ error: 'Profile not found' });
      res.json(profile);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };



  // Update profile
  const updateProfile = async (req, res) => {
    try {
      const profile = await TeacherRegistration.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!profile) return res.status(404).json({ error: 'Profile not found' });
      res.json(profile);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  // Delete profile
  const deleteProfile = async (req, res) => {
    try {
      const profile = await TeacherRegistration.findByIdAndDelete(req.params.id);
      if (!profile) return res.status(404).json({ error: 'Profile not found' });
      res.json({ message: 'Profile deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  
  module.exports = { home, register, login, getProfiles, getProfileById, updateProfile, deleteProfile, getProfileByEmail };