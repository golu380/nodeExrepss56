const Users = require("../Models/Users")
const bcrypt= require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { generateRefreshToken ,generateAcessToken} = require("../utils/generateToken");

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     // 1. Validate required fields
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, email and password are required"
//       });
//     }
//     // 2. Validate password length
//     if (password.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 6 characters"
//       });
//     }
//     // 3. Check if user already exists
//     const existingUser = await User.findOne({
//       email: email.toLowerCase()
//     });
//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "User with this email already exists"
//       });
//     }
//     // 4. Hash password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     // 5. Create user
//     const user = await User.create({
//       name,
//       email: email.toLowerCase(),
//       password: hashedPassword
//     });
//     // 6. Send response
//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// }

// const loginUser = async(req,res)=>{
//     console.log(req.body)
//     try{
//         const {email, password} = req.body;

//         if(!email || !password){
//             return res.status(400).json({
//                 success:false,
//                 message:"Email and password are required"
//             })
//         }
//         const user = await User.findOne({
//             email:email.toLowerCase()
//         })
//         if(!user){
//             return res.status(401).json({
//                 success:false,
//                 message:"User not found/Invalid credentials"

//             })
//         }

//         const isMatch = await bcrypt.compare(password,user.password);
//         if(!isMatch){
//             return res.status(401).json({
//                 success:false,
//                 message:"Invalid credentials"
//             })
//         }
//         const token = jwt.sign(
//             {id: user._id,email:user.email},
//             process.env.JWT_SECRET || "raunak_super_secret_key",
//             {expiresIn:"1h"}
//         )

//         return res.status(200).json({
//             success: true,
//             message:"Login successful",
//             token,
//             user:{
//                 id:user._id,
//                 name:user.name,
//                 email:user.email
//             }
//         })

//     }catch(err){
//         console.log(err)
//     }

// }

// const loginUserr = async(req,res)=>{

//   console.log(req.body)

//   try{

//     const {email, password} = req.body;
//     console.log(email)
//     console.log(password)

//     if(!email || !password){

//       return res.status(400).json({
//         success:false,
//         message: 'both email and password required'
//       })

//     }

//     const user = await User.findOne({email:email.toLowerCase()})
//     console.log(user)
//     if(!user){
//       return res.status(401).json({
//         success:false,
//         message:'Invalid credentials!'
//       })
//     }

//     const isMatch = await bcrypt.compare(password,user.password)

//     if(!isMatch){
//         return res.status(401).json({
//         success:false,
//         message:'Invalid credentials!'
//       })
//     }
//     console.log(process.env.JWT_SECRET)
//     const token = jwt.sign(
//     {id:user._id,email:user.email},
//     process.env.JWT_SECRET,
//     {expiresIn:"1h"}
//     )

//     return res.status(200).json({
//       success:true,
//       message:'login successfull',
//        token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     })


//   }catch(err){
//     console.error("Login Error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     })
//   }
// }
// const getProfile = async(req,res)=>{
//   res.send("hi from the profile")


// }

const registerUser = async (req,res) =>{

  try{
    const {name,email,password} = req.body;


    if(!name || !email || !password){
      return res.status(400).json({
        message:"All fields are required"
      });
    }
    const existingUser = await Users.findOne({email});
    if(existingUser){
      return res.status(400).json({
        message:"user allready exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password,10)
    // console.log("hashed"+hashedPassword)

    const verificationToken = crypto.randomBytes(32).toString("hex");
    // console.log("verification: "+verificationToken)
      const user = await Users.create({ 
            name, 
            email, 
            password: hashedPassword, 
            verificationToken 
        }); 
        // console.log(user)

        // const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
              const verificationUrl = `http://localhost:8080/auth/verify-email/${verificationToken}`;
        await sendEmail({
          to:email,
          subject:"verify your email",
          html:`
          <h2> Welcome ${name} </h2>
          <p> Please verity you email address</p>
          <a href="${verificationUrl}"> 
                    Verify Email 
                </a> 
          `
        })

        res.status(201).json({
          message:"Registration successfull check your email!"
        })
  }catch(err){
    return  res.status(500).json({ 
            message: err.message 
        });
  }
}

const  verifyEmail = async(req,res)=>{
console.log(req.params)

try{

  const {token }=  req.params;

const user = await Users.findOne({
  verificationToken : token
})

if(!user){
  return res.staus(400).json({
    message:"invalid varification token"
  })
}


user.isVerified = true;
user.verificationToken = undefined;

await user.save()

res.json({
  message:"email verified successfully"
})

  
}catch(err){
  return res.status(500).json({
    message:err.message
  })
}



}

const loginUser = async(req,res) =>{
  console.log(req.body)

  try{

    const {email,password} = req.body;
    const user = await Users.findOne({email});

    if(!user){
      return res.status(401).json({
        message:"invalid email or password"
      })
    }

    const passMatch = await bcrypt.compare(password, user.password);

       if(!passMatch){
      return res.status(401).json({
        message:"invalid email or password"
      })
    }

    if(!user.isVerified){
      return res.status(403).json({
        message:"Please verify your email first"
      })
    }

    const accessToken = generateAcessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save()

    res.status(201).json({
      message:"Login successfull",
      accessToken,
      refreshToken,


      user:{
        id: user._id,
        name:user.name,
        email:user.email,
        role:user.role
      }
    })



  }catch(err){
       res.status(500).json({ 
            message: err.message 
        }); 
  }
}

const forgotPassword =  async(req,res) =>{
  console.log("hi from forgot password")

  try{
    const {email} = req.body;
    const user = await Users.findOne({email});

    if(!user){
      return res.json({
        message: "if the email exits , resent link has been set"
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256")
                              .update(resetToken)
                              .digest("hex");

    
    user.resetPasswordExpire = Date.now() + 15* 60 *1000;

    await user.save();

    const resetURL = 
            `http://localhost:8080/auth/reset-password/${resetToken}`; 

    await sendEmail({
      to:user.email,
      subject:"password reset request",

      html:`
      <h2> Password Reset</h2>

      <p> 
                    You requested to reset your password. 
                </p> 
 
                <p> 
                    This link will expire in 15 minutes. 
                </p> 
 
                <a href="${resetURL}"> 
                    Reset Password 
                </a>
      `
    })


res.json({
  message:"if the email exsts , a reset link has been set"
})



  }catch(err){
    console.log(err)

    res.status(500).json({
      message:err.message
    })
  }


}
module.exports = {
    registerUser,
    verifyEmail,
  //  getProfile,
    loginUser,
    forgotPassword

}