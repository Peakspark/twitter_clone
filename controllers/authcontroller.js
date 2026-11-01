import User from "../prisma/schema.prisma"
//signup

export const signup = async(req,res)=>{
    //check all feilds 
    try{
        const {name , email , password} = req.body ;

        if(!name || !email || !password ){
            return res.status(400).json({
                success : false ,
                message : "ALL feilds are required"
            });
        }

        const Normalisedemail = email.trim.toLowerCase()

        const existinguser = await  User.findOne({
            email : Normalisedemail
        })

        if(email == existinguser){
            return res.status(400).json({
                success : false ,
                message : "Email dosent exist"
            })
        }

        const createuser = await User.create({
            name : name , 
            email : Normalisedemail , 
            password : password
        })
        
        
    }
    catch{

    }
};

export const login = async(req,res)=>{
    try{
    const {email , password } = req.body 
    
    const useremail = await User.findone({
        email 
    });

    if (!usermail){
        return req.send(400).json({
            message : "User not found please register!"
        });
    }
    const ispasswordcorrect = await bcrypt.comapre(password , useremail.password);
    if(!ispasswordcorrect){
        return res.status(401).json({
            success : false ,
            message : "Invalid email or password "
        });
    }
    return res.send(200).json({
        message : "Login Succesfull"
    })
    }
    catch{

    }
};
