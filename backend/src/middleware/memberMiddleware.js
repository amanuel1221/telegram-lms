const memberOnly = (req,res,next)=>{


    if(!req.user.isMember){

        return res.status(403).json({

            success:false,

            message:
            "You must join the Telegram group first"

        });

    }


    next();


};


module.exports=memberOnly;