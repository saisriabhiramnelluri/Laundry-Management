require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const ExpressError = require('./utils/ExpressError');

const app = express();

// Database connection
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry';

async function connectDB() {
    try {
        console.log('🔗 Connecting to MongoDB at', dbUrl);
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('💡 Make sure MongoDB is running locally on port 27017');
        process.exit(1);
    }
}

connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'somesecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(flash());

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.session.user || null;
  next();
});

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const managerRoutes = require('./routes/manager');
const orderRoutes = require('./routes/orders');

// Home route
app.get('/', (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === 'student') {
      return res.redirect('/student/dashboard');
    } else {
      return res.redirect('/manager/dashboard');
    }
  }
  res.render('home', { title: 'Laundry Management System' });
});

// Use routes
app.use('/', authRoutes);
app.use('/student', studentRoutes);
app.use('/manager', managerRoutes);
app.use('/orders', orderRoutes);

// 404 handler
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// Error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
