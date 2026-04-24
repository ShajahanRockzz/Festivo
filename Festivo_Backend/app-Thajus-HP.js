var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var revenueRouter = require('./routes/revenue');
var registrationRouter = require('./routes/registration');
var institutionRegistrationRouter = require('./routes/institution-registration');
var otpRouter = require('./routes/otp');
var loginRouter = require('./routes/login');
var categoryRouter = require('./routes/category');
var subscriptionRouter = require('./routes/subscription');
var festRouter = require('./routes/fest');
var competitionsRouter = require('./routes/competitions');
var assignmentsRouter = require('./routes/assignments');
var coordinatorsRouter = require('./routes/coordinators');
var paymentRouter = require('./routes/payment');
var participantsRouter = require('./routes/participants');
var contactRouter = require('./routes/contact');

var app = express();

// Setup file upload directory
var uploadDir = path.join(__dirname, 'public', 'uploads');

// Configure multer for file uploads
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

var upload = multer({ storage: storage });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/revenue', revenueRouter);
app.use('/api/institution', usersRouter);
app.use('/api/registration', upload.fields([
  { name: 'institution_id_proof', maxCount: 1 },
  { name: 'participantimage', maxCount: 1 }
]), registrationRouter);
app.use('/api/institution-registration', upload.single('institution_image'), institutionRegistrationRouter);
app.use('/api/otp', otpRouter);
app.use('/api/login', loginRouter);
app.use('/api/category', upload.single('category_image'), categoryRouter);
app.use('/api/fest', upload.fields([
  { name: 'fest_image', maxCount: 1 },
  { name: 'brochure', maxCount: 1 }
]), festRouter);
app.use('/api/coordinators', upload.single('image'), coordinatorsRouter);

// File upload endpoint for competition images
app.post('/api/upload-competition-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image file provided'
    });
  }

  const filename = req.file.filename;
  res.json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      filename: filename,
      filepath: `/public/uploads/${filename}`
    }
  });
});

app.use('/api/competitions', upload.any(), competitionsRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/participants', participantsRouter);
app.use('/api/subscription', subscriptionRouter);
app.use('/api/plans', paymentRouter); // GET /api/plans for listing, POST would be different path
app.use('/api/payment', paymentRouter); // POST /api/payment/process for payment processing
app.use('/api/contact', contactRouter);

module.exports = app;
