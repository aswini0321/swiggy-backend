
const Firm = require('../models/Firm');
const Vendor=require('../models/Vendor');
const jwt=require('jsonwebtoken');
const dotEnv=require('dotenv');
dotEnv.config();
const secretkey=process.env.whatIsyourName;
const verifyToken=async(req,res,next)=>
    {
         const token=req.headers.token;
         if(!token)
         {
            return res.status(401).json({error:"token is required"});
         }
         try
         {
              const decoded=jwt.verify(token,secretkey);
              const vendor=await Vendor.findById(decoded.vendorId);
              if(!vendor)
              {
               return res.status(400).json({error:"vendor not found"});
              }
              req.vendorId=vendor._id;
              next()
         }
         catch(error)
         {
             console.error(error);
             return res.status(500).json({error:"invalid token"});
         }
    }
    module.exports=verifyToken;