import express from 'express'
import authMiddleware from '../Middleware/authMiddleware.js'
import userController from '../Controllers/userController.js'
import adminController from '../Controllers/adminController.js'

const router=express.Router()

router.post('/user-register',userController.signup)
router.post('/user-login',userController.login)
router.get('/verify',authMiddleware.userMiddleware,userController.isVerify)
router.get('/logout',authMiddleware.userMiddleware,userController.logout)
router.get('/getUser/:id',authMiddleware.userMiddleware,userController.profileEdit)
router.put('/updateProfile/:id',authMiddleware.userMiddleware,userController.updateName)

router.get('/getAllUsers',authMiddleware.userMiddleware,adminController.getAllUsers)
router.put('/updateUserRole/:id',authMiddleware.userMiddleware,adminController.changeUserToAdmin)

export {router as UserRouter}