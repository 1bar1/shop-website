import userModel from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

//function to get user name
const getUserName = async (req, res) => {
    try {
        const userId = req.body.userId
        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        res.json({ success: true, name: user.name })
    } 
    catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

// function to get user address
const getUserAddress = async (req, res) => {
    try {
        const userId = req.body.userId
        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        res.json({ success: true, address: user.address })
    } 
    catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}


//route for updating user address
const updateAddress = async (req, res) => {
    try {
        const userId = req.body.userId
        const { firstName, lastName, email, street, city, state, zipcode, country, phone } = req.body

        const updateData = {
            address: {
                ...(firstName && { firstName }), 
                ...(lastName && { lastName }),
                ...(email && { email }),
                ...(street && { street }),
                ...(city && { city }),
                ...(state && { state }),
                ...(zipcode && { zipcode }),
                ...(country && { country }),
                ...(phone && { phone }),
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            {new: true}
        )

        if(!updatedUser){
            return res.json({ success: false, message: "User not found" })
        }

        res.json({ success: true, message: "Address updated successfully", user: updatedUser })

    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

//route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token, name: user.name })
        } else {
            res.json({ success: false, message: "Incorrect password" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



//route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        //check if email already exists
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        //email and password validation
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email address" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//route for admin login
const adminLogin = async (req, res) => {
    try {
        const {email,password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success:true, token})
        }
        else{
            res.json({success:false,message:"invalid credentials"})
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin, updateAddress, getUserAddress }