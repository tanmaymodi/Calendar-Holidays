const mongoose = require('mongoose');
const Schema = mongoose.Schema

const FormSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    }, 
    quote: {
        type: String,
        required: [true, "quotes required"]
    }
})

const authSchema = new Schema({
    email:{
        type: String,
        required: [true, "Email required for auth"]
    },
    password: {
        type: String,
        required: [true, "password reqired for auth"]
    }
})

const Form = mongoose.model("Form", FormSchema);
const AuthData = mongoose.model("AuthData",authSchema);
module.exports= {
    Form,
    AuthData
}