const Firm =require('../models/Firm');
const Vendor=require('../models/Vendor');
const multer=require('multer');
const path=require('path');
const storage = multer.diskStorage({
    destination:function (req, file, cb){
      cb(null, 'uploads/');
    },
    filename:function (req, file, cb) {
      cb(null, Date.now()+path.extname(file.originalname));
    }
  });
  const upload=multer({storage:storage});
const addFirm=async(req,res)=>
{
      try
      {
        const { firmName, area, category, region, offer} =req.body;
        const image=req.file?req.file.filename:undefined;
        const vendor=await Vendor.findById(req.vendorId);
        if(!vendor)
        {
            return res.status(404).json({message:"vendor not found"});
        }
        if(vendor.firm.length>0)
          {
           return res.status(400).json({message:"vendor can have only one firm"});
          }
        const firm=new Firm({
         firmName, area, category, region, offer,image,vendor:vendor._id
        })
         const savedFirm =await firm.save();
         const firmId=savedFirm._id;
         vendor.firm.push(savedFirm);
         await vendor.save();
         console.log("firm added successfully");
         return res.status(201).json({message:"firm added successfully",firmId})     
        }
      catch(error)
      {
         console.error(error);
         return res.status(500).json({message:"internal server error"});
      }
}
const deleteFirmById=async(req,res)=>
  {
    try
    {
         const firmId=req.params.id;
         const deletedFirm=await Firm.findById(firmId);
         if(!deletedFirm)
         {
          return res.status(404).json({error:"no firm found"});
         }
    }
    catch(error)
    {
      console.error(error);
      return res.status(500).json({error:"Internal server error"});
    }
  }
  module.exports = { addFirm: [upload.single('image'), addFirm, ] ,deleteFirmById};
