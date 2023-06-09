const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        unique: true,
      },
    mobilenumber: {
        type: Number,
        required: [true, 'Please add an mobile number'],
        unique: true,
      },
    imagefile:{
      type:String,
      required:true
        
    },
    emailverified:{
      type:Boolean,
      default:false
    },
    mobileverified:{
      type:Boolean,
      default:false
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('user', userSchema)