import { User } from "../Models/userCollection.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from "../Utilis/logger.js";
import dotenv from 'dotenv';
dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const userController = {
    signup: async (req, res) => {
        try {
            const { name, email, password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                logger.warn(`Signup attempt failed: Passwords do not match for email ${email}.`);
                return res.status(400).json({ success: false, message: "Passwords do not match" });
            }
            if (email === ADMIN_EMAIL) {
                return res.status(403).json({ success: false, message: "Admin account" });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                logger.warn(`Signup failed: User with email ${email} already exists.`);
                return res.status(409).json({ success: false, message: "User already registered" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                role:'user',
            });
            await newUser.save();
            logger.info(`User registered successfully with email: ${email}`);

            return res.status(201).json({ success: true, message: "User registered successfully" });

        } catch (error) {
            logger.error(`Signup error for email ${req.body.email}: ${error.message}`);
            return res.status(500).json({ success: false, message: "An error occurred while registering the user. Please try again." });
        }
    },

    login: async (req, res) => {
        try {
            
            const { email, password } = req.body;
            if (email === ADMIN_EMAIL) {
                if (password != ADMIN_PASSWORD) {
                    return res.status(401).json({ success: false, message: "Incorrect password" });
                }

                // Generate JWT for Admin
                const token = jwt.sign({ email: ADMIN_EMAIL, role: "admin" }, process.env.KEY, { expiresIn: "1h" });

                res.cookie("token", token, { httpOnly: true, maxAge: 360000 });
                return res.json({ success: true, message: "Admin login successful", user: { email: ADMIN_EMAIL, role: "admin" }, token });
            }
            const user = await User.findOne({ email: email });

            if (!user) {
                logger.warn(`Login attempt failed: User with email ${email} not found.`);
                return res.status(400).json({ success: false, message: "User not registered" });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                logger.warn(`Login attempt failed: Incorrect password for email ${email}.`);
                return res.status(400).json({ success: false, message: "Incorrect password" });
            }

            const token = jwt.sign({ email: user.email, role: 'user' }, process.env.KEY, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

            logger.info(`User logged in successfully: ${email}`);
            return res.json({ success: true, message: "Login successfully", user, token });

        } catch (error) {
            logger.error(`Login error for email ${req.body.email}: ${error.message}`);
            return res.status(500).json({ success: false, message: "An error occurred while logging in. Please try again." });
        }
    },

    isVerify: async (req, res) => {
        try {
            logger.info(`User verified: ${req.user.email}`);
            return res.status(200).json({ success: true, message: "User verified", user: req.user });
        } catch (error) {
            logger.error(`Verification error: ${error.message}`);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    logout: async (req, res) => {
        try {
            logger.info(`User logged out successfully: ${req.user?.email || "Unknown user"}`);
            res.clearCookie('token');
            return res.status(200).json({ success: true, message: "User logged out successfully" });
        } catch (error) {
            logger.error(`Logout error: ${error.message}`);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    profileEdit: async (req, res) => {
        try {
          const user = await User.findById(req.params.id);
          if (!user) return res.status(404).json({ error: 'User not found' });
          res.json(user);
        } catch (err) {
          res.status(500).json({ error: 'Server error' });
        }
      },
     updateName: async (req, res) => {
        try {
          const { name } = req.body;
          const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true } 
          );
      
          if (!updatedUser) return res.status(404).json({ error: 'User not found' });
      
          res.json({ name: updatedUser.name });
        } catch (err) {
          res.status(500).json({ error: 'Server error' });
        }
      }   
};

export default userController;
