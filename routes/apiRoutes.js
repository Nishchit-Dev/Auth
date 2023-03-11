const express = require('express')
const passport = require('passport')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('../config')


router.post('/signup',passport.authenticate('signup',{session:false}),async (req,res,next)=>{
    res.json({
        message:"signup successfully",
        user:req.user
    })
})

router.post('/login',async(req,res,next)=>{

    console.log(req.body)
    passport.authenticate('login',async(err,user,info)=>{
        try{
            
            if(err || !user){
                console.log(err)
                const error = new Error("An Error Occured")
                return next(error)
            }

            req.login(user,{session:false},async(error)=>{
                if(error)
                    return next(error)

                const body = {_id:user._id,email:user.email};
                const token = jwt.sign({user:body},config.secretKey)

                return res.json({token})
            })

        }catch(error){
            return  next(error)
        }
    })(req,res,next)

})

module.exports = router