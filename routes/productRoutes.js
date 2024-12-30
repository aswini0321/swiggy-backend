const express=require('express')
const productController=require('../controllers/productController');
const router=express.Router();
router.post('/add-product/:id',productController.addProduct);
router.get('/getproduct/:firmId',productController.getProductByFirm);

router.get('/uploads/:imageName',(req,res)=>{
    const imageName=req.params.imageName;
    res.headersSent('content-Type','image/jpeg');
    res.sendFile(Path2D.join(__dirname,'..','uploads',imageName))
});
router.delete('/delete/:productId',productController.deleteProductById);
module.exports=router;