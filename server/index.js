const cors = require("cors");
const express = require("express");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

app.use(cors())

app.use(cookieParser());
const port = 8000;
const secret = "mysecret";

let conn = null

// function init connection mysql
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tutorial",
  });
};

/*  code  */
app.post('/user/register', async (req,res)=>{
    const {email , password} = req.body;
    const passwordHash = await bcrypt.hash(password , 10)
    //sault = 10
    const userData = {
        email,
        password : passwordHash
    }
    try{
        const result = await conn.query("INSERT INTO users SET ?", userData);
        res.json({
            message : "insert ok"
        })
    }
    catch(err){
        res.json({
            message: "insert error",
            err :err
        })
        
    }
   
   
});
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const [result] = await conn.query("SELECT * from users WHERE email = ?", email);
    const user = result[0];
    console.log(result[0])
    const match = bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).send({ message: "Invalid email or password" });
      }
    
      //create toekn
      const token = jwt.sign({ email, role: "admin" }, secret, { expiresIn: "1h" });   
     // res.send({ message: "Login successful", token });
     // way 2 backend set token in cookie
     //-------------this code will set token in cookie web browser-------------------
     res.cookie('token',token , {
        maxAge: 300000,
        secure: true,
        httpOnly: true,
        sameSite: "none"
     });
  });

app.get('/users', async (req,res)=>{


    try{
        //way 1 when request api send token with header to request access
       // const authHeader = req.headers["authorization"];
        
        // let authToken = ''
        // if(authHeader){
        //     authToken = authHeader.split(' ')[1]
        // }






        // ------------way 2 when request api ja pai aw cookie nai broser ma check 

        const authToken = req.cookies.token

        const user = jwt.verify(authToken , secret)
        // console.log("auth token", authToken)
        // console.log(user.email);
        const [checkEmail]  = await conn.query('SELECT * from users where email = ?', user.email)
        console.log(user.email)
       if(!checkEmail){
        throw {message : "user not fround"}
       }
       
        const [result] = await conn.query('SELECT * from users')
        res.json({
            response : result
        })
    }catch(err){
        res.json({
            message: "insert error",
            err :err
        })
        
    }
   
});

// Listen
app.listen(port, async () => {
  await initMySQL();
  console.log("Server started at port 8000");
});