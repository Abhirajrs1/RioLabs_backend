import express from 'express'
import authMiddleware from '../Middleware/authMiddleware.js'
import userController from '../Controllers/userController.js'
import adminController from '../Controllers/adminController.js'
import multer from 'multer'
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const router=express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads'); 
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });;

router.post('/user-register',userController.signup)
router.post('/user-login',userController.login)
router.get('/verify',authMiddleware.userMiddleware,userController.isVerify)
router.get('/logout',authMiddleware.userMiddleware,userController.logout)
router.get('/getUser/:id',authMiddleware.userMiddleware,userController.profileEdit)
router.put('/updateProfile/:id',authMiddleware.userMiddleware,userController.updateName)

router.get('/getAllUsers',authMiddleware.userMiddleware,adminController.getAllUsers)
router.put('/updateUserRole/:id',authMiddleware.userMiddleware,adminController.changeUserToAdmin)
router.get('/categories',authMiddleware.userMiddleware,adminController.getCategories)
router.post('/addCategory',authMiddleware.userMiddleware,adminController.addCategory)
router.put('/categories/:id',authMiddleware.userMiddleware,adminController.updateCategory)
router.get('/categories/:id',authMiddleware.userMiddleware,adminController.getCategoryById)
router.get('/products',authMiddleware.userMiddleware,adminController.getProducts)
router.post('/add-Product',authMiddleware.userMiddleware,adminController.addProducts)
router.put('/editProduct/:id',authMiddleware.userMiddleware,adminController.editProducts)
router.get('/products/:id',authMiddleware.userMiddleware,adminController.getProductById)
router.put('/edit-product/:id',authMiddleware.userMiddleware,adminController.editProducts)


export {router as UserRouter}