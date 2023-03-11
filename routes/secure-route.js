const express = require('express')
const secureRouter = express.Router()

secureRouter.get('/profile',(req,res,next)=>{

    res.json({
        message:"accessed secure route",
        user:req.user,
    })
})

module.exports = secureRouter


