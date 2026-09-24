const User = require("../Models/User")
const bcrypt= require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }
    // 2. Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }
    // 3. Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
    }
    // 4. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // 5. Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });
    // 6. Send response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

const loginUser = async(req,res)=>{
    console.log(req.body)
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and password are required"
            })
        }
        const user = await User.findOne({
            email:email.toLowerCase()
        })
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found/Invalid credentials"

            })
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        const token = jwt.sign(
            {id: user._id,email:user.email},
            process.env.JWT_SECRET || "raunak_super_secret_key",
            {expiresIn:"1h"}
        )

        return res.status(200).json({
            success: true,
            message:"Login successful",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })

    }catch(err){
        console.log(err)
    }

}
module.exports = {
    registerUser,
    loginUser
}