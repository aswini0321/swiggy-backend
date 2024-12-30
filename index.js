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
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout for server selection
      socketTimeoutMS: 45000,         // Increase socket timeout
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

// Call the connection function
connectToDatabase();

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