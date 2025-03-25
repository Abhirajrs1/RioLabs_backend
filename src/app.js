import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import Session  from 'express-session';

dotenv.config()

const app=express()

const port=process.env.PORT ||3000

const connectDB = async () => {
    const dbURI = process.env.MONGODB_URL_COMPASS
  
    try {
      await mongoose.connect(dbURI, {
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.error('Error while connecting to DB:', error);
      process.exit(1);
    }
  };

  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,PATCH'
  }));
  
  app.use(cookieParser());
  app.use(Session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    }
  }));

  app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }))

  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });