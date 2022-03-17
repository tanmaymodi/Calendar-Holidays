const mongoose = require('mongoose');
const Schema = mongoose.Schema

const tanmay_111915132_detail = new Schema({
    eid: String,
    firstName: String,
    lastName: String,
    dob: Date,
    contactNumber: String,
    password:String
})

const tanmay_111915132_salary = new Schema({
    eid: String,
    jobRole: String,
    monthlySalary: String,
    yearlyBonus:String
})

const Tanmay_111915132_detail = mongoose.model("Tanmay_111915132_detail", tanmay_111915132_detail);
const Tanmay_111915132_salary = mongoose.model("Tanmay_111915132_salary",tanmay_111915132_salary);
module.exports= {
    Tanmay_111915132_detail,
    Tanmay_111915132_salary
}