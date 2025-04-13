import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ success: false, message: 'Not Authorized Login Again' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.body.userId = decoded.id
    next()
  } catch (error) {
    console.log('JWT Error:', error)
    res.json({ success: false, message: error.message })
  }
}

export default authUser 
