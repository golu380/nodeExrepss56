const jwt = require("jsonwebtoken");

const generateAcessToken = (user) =>{

    return jwt.sign(
        {
            id:user._id,
            role:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn : process.env.JWT_EXPIRE
        }
    )
}

const generateRefreshToken = (user) =>{

    return jwt.sign(
        {
            id:user._id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn : process.env.JWT_REFRESH_EXPIRE
        }
    )
}

module.exports = {
    generateAcessToken,
    generateRefreshToken
}