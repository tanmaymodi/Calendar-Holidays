//express module
var express = require("express");
var app=express()
//env module
require('dotenv').config;
//presenting front-end in html engine 
const engine = require('consolidate');
//mongodb cofig files
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient
const {
    Tanmay_111915132_detail,
    Tanmay_111915132_salary
} = require('./models/user');
// const UID = schemStyle.Tanmay_111915132_detail;
// const SID = schemStyle.Tanmay_111915132_salary;
const jwt = require('jsonwebtoken');
var path = require('path')
app.use(express.static(path.join(__dirname, 'public')));
//connection to mongodb
connectDB();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var login__ = false;
// node fetch api
const fetch = require('node-fetch');
//post numbers
const PORT = process.env.PORT || 3000;

  


var server = require('http').createServer(app);

app.set('views', __dirname + '/views');
app.engine('html', engine.mustache);
app.set('view engine', 'html');

app.use('/home',require('./routes/index'));

app.post('/forms', async(req,res) =>{
    try{
        console.log(req.body);
        var name = await JSON.parse(JSON.stringify(req.body));
        console.log(name);
        var insertObj = new Form(name);
        await insertObj.save();
        res.sendFile(__dirname+'/views/index.html' )
        return;
    } catch (err){
        console.log("Err -- ", err);
        res.sendFile(__dirname+'/views/index.html' )
        return;
    }
});

app.get('/auth',(req,res) => {
    res.render('auth.html');
});
//signin
app.post('/login',async(req,res)=> {
    try{
        var b = req.body;
        //console.log(b);
        const {eid, password} = b;
        console.log(eid,password);
        const result = await Tanmay_111915132_detail.findOne({eid:eid});
        if(result){
            const result2 = await Tanmay_111915132_detail.findOne({email:email,password:password});
            if(result2){
                var message = "login successful";
                var code = 200;
                return res.send({status: message,code:code});
            }
            var code = 405;
            var message = "incorrect password";
            return res.send({status: message,code:code});
        }
    }
    catch(err){
        var code = 404;
        var message = "login success";
        return res.send({status: message,code:code});
    }
});
//sigup
app.post('/signup', async(req,res) => {
   // try{
        var b = req.body;
        //console.log(b);
        const {eid, firstName, lastName, dob, contactNumber, password,jr,ms,yb} = b;
        //console.log(eid,firstName,dob);
        var newUser = {
            eid,
            firstName,
            lastName,
            dob,
            contactNumber,
            password
        };
        jobRole = jr;
        monthlySalary = ms;
        yearlyBonus = yb;
        var userSalary = {
            eid,
            jobRole,
            monthlySalary,
            yearlyBonus
        };
        console.log(newUser);
        //console.log(userSalary);
        var ggg = new Tanmay_111915132_detail(newUser);
        var yyy = new Tanmay_111915132_salary(userSalary);
        await ggg.save();
        await yyy.save();
        var status = "succefull signup";
        return res.send({status: status});
    //}   
    // catch(err){
    //     var status = "signup error: " + err.toString();
    //     return res.send({status: status});
    // }
});
//update
app.post('/update', async(req,res) =>{
    try{
        console.log(req.body);
        var body = await JSON.parse(JSON.stringify(req.body));
        console.log(body);
        await Form.updateOne({name:body.name},{$set:body});
        res.sendFile(__dirname+'/views/index.html' )
        return;  
    } catch(err){
        console.log("Err -- ", err);
        res.sendFile(__dirname+'/views/index.html' )
        return;
    }
});

app.post("/fetch", async(req, res) => {
    try{
       const d = Tanmay_111915132_detail.find({});
       const e = Tanmay_111915132_salary.find({});
       res.send({dd:d,ee:e});
            
    } catch (err){
        console.log("Err -- ", err);
        res.sendFile(__dirname+'/views/index.html' )
        return;
    }
});

app.post('/getData', async(req, res) => {
    try{
        var body = req.body;
        console.log("bosy -- ", body);
        var sd = new Date(body['startDate']);
        var ed = new Date(body['endDate']);
        fetch(
            "https://www.gov.uk/bank-holidays.json"
        )
            .then((response) => response.json())
            .then((data) => {
                
                var events = data[body['zone']]['events'];
                var ans = [];
                events.forEach(event => {
                    var evd = new Date(event['date']);
                    if(evd>=sd && evd<=ed){
                        ans.push({
                            "title": event["title"],
                            "date": event["date"]
                        });
                    }
                });
                console.log("holidays: ", ans);
                return res.send({'holidays':ans} );
            })
            .catch((err) => console.log(err));
    } catch (err) {
        console.log("getData error -- ", err);
    }
});



app.get('/home',(req,res)=>{
    //console.log("home executed");
    try{
        if(login__==true){
            return res.render("index.html");
        }
        else{
            return res.render("auth.html");
        }
    }
    catch(err){
        res.render("auth.html");
    }
});
app.post('/logout',(req,res)=>{
    console.log("logout executed");
    login__ = false;
    try{
        login__ = false;
        res.render("auth.html");
    }catch(err){
        res.render("auth.html");
    }
})
app.post('/quotes', (req, res) => {
    console.log(req.body)
    res.sendFile(__dirname+'/views/index.html' )
});


app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
  });
  

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }


server.listen(PORT, () => {console.log("Server started at "+PORT)});
console.log("server listening at: ", PORT);