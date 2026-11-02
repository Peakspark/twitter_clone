const User = require('../models/authmodel.js');
const bcrypt = require('bcrypt');

const signup = async (req,res)=>{
    try {
        const {name , email , password} = req.body;
        // check all feilds 
        if (!name || !email || !password){
            res.status(400).json({
                message : "all feilds are required"
            })
        }
        const name_normal = name.trim()
        const email_normal = email.trim().toLowerCase()
        const hash_p = await  bcrypt.hash(password , 10)

        // check user already exist or not 

        const find_user = await User.findOne({
            email
        })

        if(find_user){
            res.status(200).json({
                message : "please login user already exist"
            })
            console.log("please login")
        }
        //create user 
        const new_user = await User.create({
            name : name_normal ,
            email : email_normal,
            password : hash_p
        })
        if(new_user){
            res.status(201).json({
                message : "user created "
            })
        }
    }
    catch{
        console.log("incoorect")
    }
}
//login 
const login = async(req , res)=>{
    try {
    const {email , name , password} = req.body ;

    //user not exist 
    const email_normal = User.findOne({
        email
    })
    if(!email_normal){
        res.status(400).json({
            message: "user not exist please signup"
        })
    }
    //login
    
    
    }
    catch{}
    
}

module.exports = {signup};