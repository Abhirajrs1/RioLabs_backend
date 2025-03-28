import mongoose from 'mongoose'
const UserSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
      }
},{
    timestamps:true
})

export const User=mongoose.model('User',UserSchema)