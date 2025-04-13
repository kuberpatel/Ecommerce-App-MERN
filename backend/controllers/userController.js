import validator from 'validator'
import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const createToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' }) 
}

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
     console.log('Login attempt:', email, password) 
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = createToken(user._id)
      return res.json({ success: true, token })
    } else {
      return res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    console.log('Register attempt:', name, email, password)


    // Checking if the user already exists
    const exists = await userModel.findOne({ email })
    if (exists) {
      return res.json({ success: false, message: 'User already exists' })
    }

    // Validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' })
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: 'Please enter a strong password',
      })
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    })

    const user = await newUser.save()
    const token = createToken(user._id)

    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials ' })
    }
  } catch (error) {}
}

// Add this new controller function
const getUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId // This comes from the auth middleware
    const user = await userModel.findById(userId).select('-password') // Exclude password
    
    if (!user) {
      return res.json({ 
        success: false, 
        message: 'User not found' 
      })
    }

    res.json({ 
      success: true, 
      user 
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.json({ 
      success: false, 
      message: error.message 
    })
  }
}

export { loginUser, registerUser, adminLogin, getUserProfile }
