import express from 'express'
import {loginUser, registerUser, adminLogin, updateAddress, getUserAddress} from '../controllers/userController.js'
import authUser from '../middleware/auth.js'


const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.get('/address', authUser, getUserAddress)
userRouter.post('/update-address', authUser, updateAddress)

export default userRouter