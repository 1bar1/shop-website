import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const {token} = req.headers

    if (!token) {
        console.log("auth token: " + token)
        return res.json({success:false, message: 'Not authorized, login again.'})
    }
    try {
        //console.log('Received token:', token)
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()

    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }

}

export default authUser