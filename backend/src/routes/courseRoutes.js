const express=require("express");
const router=express.Router();

const protect=require("../middleware/authMiddleware");
const memberOnly=require("../middleware/memberMiddleware");


router.get(
"/courses",
protect,
memberOnly,
(req,res)=>{


res.json({

message:
"Welcome to LMS courses"


});


});


module.exports=router;