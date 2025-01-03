const Vendor=require('../models/Vendor');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const dotEnv=require('dotenv');
dotEnv.config();
const secretkey=process.env.whatIsYourName;
const vendorRegister=async(req,res)=>
{
    const {username, email, password } =req.body;
    try
    {
        const vendorEmail=await Vendor.findOne({email});
        if(vendorEmail)
        {
            return res.status(400).json("email already taken")
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newVendor=new Vendor({
            username,
            email,
            password:hashedPassword
        });
        await newVendor.save();
        res.status(201).json({message:"vendor registered successfully"})
        console.log("registered");
    }
    catch(error)
    {
        console.error(error);
         res.status(501).json({error:"internal server error"});
        
    }
}
const vendorLogin=async(req,res)=>
{
            const{email,password}=req.body;
            try{
             
                 const vendor=await Vendor.findOne({email});
                 console.log(vendor);
                 if(!vendor || !(await bcrypt.compare(password,vendor.password)))
                 {
                    return res.status(401).json({error:"invalid username or password credentials"});
                 }
                 const token=jwt.sign({vendorId:vendor._id},secretkey,{expiresIn:"1h"});
                 const vendorId=vendor._id;
                  res.status(200).json({message:"user logged successfully",token,vendorId});
                  console.log(email,token,vendorId);
            }
            catch(error)
            {
                  console.log(error);
                  res.status(500).json({error:"internal server error"});
            }
}
const getAllVendors=async(req,res)=>
{
    try{
          const vendors=await Vendor.find().populate('firm');
          res.json({vendors});
    }
    catch(error)
    {
        console.log(error);
                  res.status(500).json({error:"internal server error"});
    }
}
const getVendorById = async (req, res) => {
    const vendorId = req.params.vendorId;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" }); // Ensure response ends here
        }

        if (vendor.firm[0]) {
            const vendorFirmId = vendor.firm[0]._id;
            console.log(vendor, vendorFirmId);
            return res.status(200).json({ vendor, vendorFirmId }); // Ensure response ends here
        }

        // If no firm exists, send only vendor details
        return res.status(200).json({ vendor });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" }); // Ensure response ends here
    }
};
module.exports={vendorRegister,vendorLogin,getAllVendors,getVendorById}