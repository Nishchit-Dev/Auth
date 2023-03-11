const passport = require('passport');
const config = require('../config');
const User = require('../model/model');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/model');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use('signup',new localStrategy({
    usernameField:'email',
    passwordField:"password",
    passReqToCallback:true
},async (req,email,password,done)=>{
    try{
        const {username} = req.body

        const checkUser = await User.findOne({email})

        if(checkUser){
            console.log(checkUser) 
            return done({message:"user already exist"})
        }

        const user = await UserModel.create({username,email,password});
    
        return done(null,user)

    }catch(error){
        return done(error)
    }
}))


passport.use("login", 
    new localStrategy({
        usernameField:'email',
        passwordField:'password'
    },async (email,password,done)=>{
        try{
            const user = await User.findOne({email})

            if(!user) return done(null,false,{message:"email not found"})

            const validate = await user.isValidPassword(password)

            if(!validate) return done(null,false,{message:"incorrect password"})

            return done(null,user,{message:"Login successfully"})

        }catch(error){
            return done(error)
        }
    })
)

passport.use(
    new JWTstrategy({
        secretOrKey:config.secretKey,
        jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken()
    },async(token,done)=>{
        try{
            return done(null,token.user)
        }catch(error){
            done(error)
        }
    })
)
