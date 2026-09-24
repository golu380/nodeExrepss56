const User = require("../Models/User")

const registerUser = async(req,res)=>{
    console.log("hi from controler")

    console.log(req.body)

 

    const {name,email,password} = req.body;
    console.log(password)

    try{

        if(!name || !email || !password){
            return res.status(400).json({
                success : false,
                message:"email , password, name are required"
            })
        }

        const user = User.create({
            name,
            email,
            password
        })

    }catch(err){
        console.log(err)
    }



}

module.exports = {
    registerUser
}