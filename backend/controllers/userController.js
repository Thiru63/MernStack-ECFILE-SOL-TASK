const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
const crypto = require("crypto");
const sendEmail = require("../utils/mailSender");
const sendOtp=require('../utils/otpSender')
const Token = require("../models/tokenModel");
const Otp = require("../models/otpModel");
const otpgenerator=require('otp-generator')


// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, mobilenumber } = req.body


  if (!name || !email || !mobilenumber || !req.file  ) {
    res.status(400)
    throw new Error('Please add all fields')
  }
  if(email.length>17  || email.length<17 ){
    res.status(400)
    throw new Error('Email length should be 15 characters long')
  }
  if(mobilenumber.toString().length>10 || mobilenumber.toString().length<10){
    res.status(400)
    throw new Error('Mobile number length should be 10 digits long')
  }
  if(!(mobilenumber.toString().charAt(0) =='6'|| mobilenumber.toString().charAt(0) =='7'|| mobilenumber.toString().charAt(0) =='8'|| 
   mobilenumber.toString().charAt(0) =='9')){
    res.status(400)
    throw new Error('Mobile number  should be starts with 6 , 7 , 8 or 9')
  }
  


  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  const mn = await User.findOne({ mobilenumber })

  if (mn) {
    res.status(400)
    throw new Error('Mobile number is already registered')
  }
   
  
  // Hash password
  const mnb=mobilenumber.toString().substring(5,10)
  // const nme=name.charAt(0).toUpperCase() + name.slice(1);
  
  const password=name.toLowerCase()+mnb
  const salt = await bcrypt.genSalt(10)
  const hashedpass = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password:hashedpass,
    mobilenumber,
    imagefile:req.file.filename,
        
    
  })


  if (user) {

    const token=await Token.create({
      userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
    })

    const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
		await sendEmail(user.email, "Verify Email", url);

    
    res
			.status(201)
			.send({ message: "An Email sent to your account please verify" });

           

  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})


// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password.toLowerCase(), user.password))) {
    if(user.emailverified && !user.mobileverified){
      const oldotp= await Otp.findOne({userId:user._id})
      if(!oldotp){
      const OTP=otpgenerator.generate(6,{
        digits:true, lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false
      })
      // await sendOtp(user.mobilenumber, OTP);
      console.log(OTP)


      const salt=await bcrypt.genSalt(10)
      const  hashedOtp=await bcrypt.hash(OTP,salt)
      const otp = await Otp.create({
        userId: user._id,
        otp: hashedOtp,
      })
      return res
			.status(201)
			.send({ message: "An Otp sent to your mobile please verify" });
    }
     return res
			.status(400)
			.send({ message: "An Otp already sent to your mobile please verify" });
    }

    if (!user.emailverified) {
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				 token=await Token.create({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        })
    
        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);

        return res
				.status(201)
				.send({ message: "An Email   sent to your account please verify" });
			}

			return res
				.status(400)
				.send({ message: "An Email  already sent to your account please verify" });
		}
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      mobilenumber:user.mobilenumber,
      imagefile:user.imagefile,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// @desc    Get users data
// @route   GET /api/users/
// @access  Private
const getUsers = asyncHandler(async (req, res) => {

  if(req.user){
    const users= await User.find()

    if(users){
     return res.status(200).json(users)
    }
  }
  res.status(400).send({message:'users not found some internal server error'})
})
// @desc    Get email token
// @route   GET /api/users/:id/verify/:token/
// @access  Public
const getemailToken = asyncHandler(async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });
                        

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		await User.findByIdAndUpdate({ _id: user._id}, {emailverified: true });
		await token.deleteOne();

		res.status(201).send({ message: "Email verified successfully"});
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
})

// @desc    otp verify
// @route   POST /api/users/otpverify/
// @access  Public
const otpVerify = asyncHandler(async (req, res) => {
	try {
		const user = await User.findOne({ mobilenumber:req.body.number });
		if (!user) return res.status(400).send({ message: "Invalid OTP" });

                        

		const otp = await Otp.findOne({
			userId: user._id,
					});
		if (!otp) return res.status(400).send({ message: "Invalid OTP" });
    if (otp && (await bcrypt.compare(req.body.otp, otp.otp))) {
      
      
      

		await User.findByIdAndUpdate({ _id: user._id}, {mobileverified: true });
		await otp.deleteOne();

    

		res.status(201).send({ message: "Mobile OTP verified successfully You can login now"});
    }else{
      res.status(400).send({ message: "Invalid OTP"});
    }
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  getemailToken,
  otpVerify,

}