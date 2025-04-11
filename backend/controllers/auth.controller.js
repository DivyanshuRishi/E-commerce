import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";

dotenv.config()

const generateToken = (userId) =>{
const accessToken = jwt.sign({userId},process.env.ACCESS_TOKEN,{
    expiresIn: "1h",
})
const refreshToken = jwt.sign({userId},process.env.REFRESH_TOKEN,{
    expiresIn:"7d",
})
return {accessToken,refreshToken};
}

const storeRefreshToken = async(userId,refreshToken) =>{
    await redis.set(`refresh_token:${userId}`,refreshToken,"EX",7*24*60*60); //7days
    console.log("Stored refresh token:", refreshToken);
}


const setCookies = (res , accessToken , refreshToken) => {
    res.cookie("accessToken" , accessToken ,{
        httpOnly:true, //prevent XSS attacks , Cross Site Scripting attack
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict", //prevents CSRF attacks, Cross Site Request Forgery attack
        maxAge: 1*60*60*1000,// 1 hour
    })
    res.cookie("refreshToken" , refreshToken ,{
        httpOnly:true, //prevent XSS attacks , Cross Site Scripting attack
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict", //prevents CSRF attacks, Cross Site Request Forgery attack
        maxAge: 7*24*60*60*1000,//7 days
    })
}

export const signup = async (req,res)=>{
    const { email , password , name } = req.body;
    
    try {
        const existingUser = await User.findOne({email});
    
    if(existingUser){
        return res.status(400).json({message : "Email already exists"});
    }

    const user = await User.create({ email , name , password});


    //authenticate
    const {accessToken, refreshToken} = generateToken(user._id);
    await storeRefreshToken(user._id,refreshToken);

    setCookies(res, accessToken , refreshToken);


    res.status(201).json({user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role: user.role,
    } , message : "User created successfully"});
    } catch (error) {
        console.log("Error in signup controller",error.message)
        res.status(500).json({message:error.message})
    }
};
export const login = async (req,res)=>{
    try {
        const {email , password} = req.body;
        const user = await User.findOne({email});
        if(user && (await user.comparePassword(password))){
            const {accessToken,refreshToken}=generateToken(user._id)
            
            await storeRefreshToken(user._id,refreshToken)
            setCookies(res,accessToken,refreshToken)

            res.json({
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    },
            })
        }
        else{
            res.status(400).json({message:"Invalid email or password"})
        }
    } catch (error) {
        console.log("Error in login controller",error.message)
        res.status(500).json({message:error.message})
    }
}
export const logout = async (req,res)=>{
    try {
        const refreshToken = req.cookies?.refreshToken; // Optional chaining to avoid error
        if (refreshToken){
            const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN)
            await redis.del(`refresh_token:${decoded.userId}`)
        }
        // Clear the cookies, make sure options match those set in `setCookies`
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({message : "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller",error.message)
        res.status(500).json({message:"Server Error ",error : error.message})
    }
}

//this will refresh the accessToken

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        // Check if the stored token matches the provided refresh token
        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Generate a new access token
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN, { expiresIn: "60m" });

        // Send new access token in cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.status(200).json({ message: "Access token refreshed successfully" });
    } catch (error) {
        console.log("Error in refreshToken controller", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// export const getProfile = async (req,res) =>{
//     try {
//         res.json(req.user);

//         // Assuming req.user contains the user object retrieved from your database
//         // Extract only the necessary fields to avoid circular reference issues
//         // const { _id, name, email } = req.user; // Modify based on your user model

//     } catch (error) {
//         console.log("Error in getProfile controller",error.message)
//         res.status(500).json({message:"Server Error ",error : error.message})
//     }
// }

export const getProfile = async (req, res) => {
    try {
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - User not logged in" });
        }

        // Return the user profile (excluding sensitive information)
        res.json(req.user);
    } catch (error) {
        console.log("Error in getProfile controller", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

