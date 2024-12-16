const express= require('express');
const app=express();
const mongoose=require('mongoose');
const dotEnv=require('dotenv');
const bodyParser=require('body-parser');
const vendorRoutes=require('./routes/vendorRoutes');
const firmRoutes=require('./routes/firmRoutes');
const productRoutes=require('./routes/productRoutes');
const cors=require('cors');
const path =require('path');
dotEnv.config();
app.use(cors());
const PORT=process.env.PORT||4000;
mongoose.connect(process.env.MONGO_URI).then(()=>
{
    console.log("mongodb connected successfully");
}).catch((error)=>
{
    console.log(error);
})
app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));

app.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`);
})
app.use('/',(req,res)=>
{
    res.send("<h1>welcome to swiggy</h1>")
})