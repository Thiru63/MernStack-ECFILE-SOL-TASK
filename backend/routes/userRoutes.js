const express = require('express')
const jwt = require('jsonwebtoken');
const router = express.Router()
const {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  getemailToken,
  otpVerify
} = require('../controllers/userController')
const { protect } = require('../middlewares/authMiddleware')

const multer = require('multer');
const imgconfig = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./frontend/src/uploads")
    },
    filename:(req,file,callback)=>{
        callback(null,`imgae-${Date.now()}. ${file.originalname}`)
    }
})
const isImage = (req,file,callback)=>{
    if(file.mimetype.startsWith("image")){
        callback(null,true)
    }else{
        
        callback(  new Error("only images are allowd"))
    }
}
const upload = multer({
    storage:imgconfig,
    fileFilter:isImage
});

router.post('/',upload.single("imagefile"), registerUser)
router.get('/', protect, getUsers)
router.post('/login', loginUser)
router.get('/user', protect, getUser)
router.get('/:id/verify/:token', getemailToken)
router.post('/otpverify', otpVerify)


module.exports = router