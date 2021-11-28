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
const userModel = require('./models/user');
const Form = userModel.Form;
const AuthData = userModel.AuthData;
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


const posts = [
    {
      username: 'Kyle',
      title: 'Post 1'
    },
    {
      username: 'Jim',
      title: 'Post 2'
    }
  ]
  


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
        var email  = b['email'];
        var password = b['password'];
        const result = await AuthData.findOne({email:email});
        if(result){
            const result2 = await AuthData.findOne({email:email,password:password});
            if(result2){
                login__ == true;
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
        var message = "login failed try again";
        return res.send({status: message,code:code});
    }
});
//sigup
app.post('/signup', async(req,res) => {
    try{
        var b = req.body;
        console.log(b);
        var email  = b['email'];
        var password = b['password'];
        const result = await AuthData.findOne({email:email});
        console.log(result);
        if(result){
            var message = "email already exits"
            return res.send({status: message});
        }
        var push = {email,password};
        console.log(push);
        var insertObj = new AuthData(push);
        await insertObj.save();
        var status = "succefull signup";
        return res.send({status: status});

    }   
    catch(err){
        var status = "signup error: " + err.toString();
        return res.send({status: status});
    }
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
        var zones = [];
        fetch(
            "https://www.gov.uk/bank-holidays.json"
        )
            .then((response) => response.json())
            .then((data) => {
                for(let key in data){
                    if(data.hasOwnProperty(key)){
                        zones.push(key);
                    }
                }
                console.log(zones);
                return res.send({zones:zones} );
            })
            .catch((err) => console.log(err));
            
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
    console.log("home executed");
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