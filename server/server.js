const express = require('express');
const path = require('path');
const cors = require('cors');
const StudentauthRoute = require('./router/student-auth-router');
const TeacherauthRoute = require('./router/teacher-auth-router');
const contactRoute = require('./router/contact-router');
const studentRouter = require('./router/studentRouter');
const teacherRouter = require('./router/teacherRouter.js');
const otpRouter = require('./router/otpRouter');
const attendanceStudentRouter = require('./router/attendanceStudentRouter.js');
const connectDb = require('./utils/db');
const { errorMiddleware } = require('./middlewares/error-middleware');
const bodyParser = require('body-parser');
const studentForgotPasswordRouter = require('./router/studentForgotPassword');
const teacherForgotPasswordRouter = require('./router/teacherForgotPassword');
const attendanceRouter = require('./router/attendanceRouter.js');

const app = express();

// lets tackle CORS issue
const corsOptions = {
  origin: 'http://localhost:5173',
  //origin: 'https://merndebanjan.netlify.app', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));


app.use(express.json());

// Profile routes
app.use('/api/students', studentRouter);
app.use('/api/teachers', teacherRouter);

//Registration and login routes
app.use("/api/student-auth", StudentauthRoute);
app.use("/api/teacher-auth", TeacherauthRoute);


app.use("/api/form", contactRoute);

//Attendance routes
app.use('/api/attendance/students', attendanceStudentRouter);
app.use('/api/attendance',attendanceRouter);


//Subject routes
const subjectRouter = require('./router/subjectRouter');
app.use('/api/subjects', subjectRouter);


// Serve uploaded files
app.use('/uploads/reports', express.static(path.join(__dirname, 'uploads/reports')));

// Report Routes
const reportRouter = require('./router/reportRouter');
app.use('/api/reports', reportRouter);


app.use(bodyParser.json());

// Mount OTP routes
app.use('/api', otpRouter);



// Mount forgot password routes
app.use('/api/student-auth/forgot-password', studentForgotPasswordRouter);
app.use('/api/teacher-auth/forgot-password', teacherForgotPasswordRouter);




app.use(errorMiddleware);


const PORT = process.env.PORT || 8000;
connectDb().then(()=>{
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  });
});