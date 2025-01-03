const Product=require('../models/Product');
const multer=require('multer');
const Firm=require('../models/Firm');
const path=require('path');
const storage = multer.diskStorage(
  {
    destination:function(req, file, cb)
    {
      cb(null, 'uploads/');
    },
    filename:function (req, file, cb) 
    {
      cb(null, Date.now()+path.extname(file.originalname));
    }
  }
);
  const upload=multer({storage:storage});
  const addProduct=async(req,res)=>
  {
    try{
          const {productName,price,category,bestSeller,description}=req.body;
          const image=req.file?req.file.filename:undefined;
          const firmId=req.params.id;
          const firm=await Firm.findById(firmId);
          if(!firm)
          {
            return res.status(401).json({error:"firm not found"});
          }
          const product =new Product({
            productName,price,category,image,bestSeller,description,firm:firm._id
          })
          const savedProduct =await product.save();
          firm.product.push(savedProduct);
          await firm.save();
          return res.status(200).json({savedProduct})
    }
    catch(error)
    {
           console.error(error);
           return res.status(500).json({error:"Internal server error"});
    }
  }
  const getProductByFirm=async(req,res)=>
  {
    try{
             const firmId= req.params.firmId;
             const firm=await Firm.findById(firmId);
             const restName=firm.firmName;
             if(!firm)
             {
              return res.status(404).json({error:"firm not found"});
             }
             const product=await Product.find({firm:firmId});
             res.status(200).json({restName,product});
    } 
    catch(error)
    {
      console.error(error);
      return res.status(500).json({error:"Internal server error"});
    }
  }
  const deleteProductById=async(req,res)=>
  {
    try
    {
         const productId=req.params.productId;
         console.log(productId);
         const deletedProduct=await Product.findByIdAndDelete(productId);
         console.log(deletedProduct);
         if(!deletedProduct)
         {
          return res.status(404).json({error:"no product found"});
         }
         return res.status(200).json({message:"product found and deleted"});
    }
    catch(error)
    {
      console.error(error);
      return res.status(500).json({error:"Internal server error"});
    }
  }
  module.exports={addProduct:[upload.single('image'),addProduct],getProductByFirm,deleteProductById};