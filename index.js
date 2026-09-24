//index.js

const express = require('express');
const moongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/AuthRoutes')
dotenv.config();
const app = express();

app.use(express.json());
app.use('/auth',authRoutes)




const PORT = process.env.PORT
const dburl = process.env.MONGO_URI

console.log(PORT)
console.log(dburl)

app.get('/',(req,res)=>{
    console.log('Hi from the server')
    res.send('Hi from the server')
})

moongoose.connect(dburl).then(()=>{
    console.log('Database connected successfully')
}).catch((err)=>{
    console.log('Error while connecting to database', err)
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})