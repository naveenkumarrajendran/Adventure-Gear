const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type:String,required:true},
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    address: { type: String },
    phoneNumber :{type: String, required:true},
    otp : {type: Number},
    otpCreatedAt: { type: Date, default: Date.now }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports=mongoose.model('User',userSchema);