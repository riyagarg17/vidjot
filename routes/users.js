const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');

//loading User model
require('../models/User');
const User=mongoose.model('users');

//user login route
router.get('/login',(req,res)=>{

    res.render('users/login');
});

//user registration route
router.get('/register',(req,res)=>{

    res.render('users/register');
});

//user register form  
router.post('/register',(req,res)=>{

    var errors=[];

    if(req.body.password!=req.body.password2)
        errors.push({text:'passwords do not match'});
    if (req.body.password.length<4)
        errors.push({text:'password must be greater than 4 characters'});

    if(errors.length>0){

        res.render('users/register',{

            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        });
    }
    else{
        
        User.findOne({email: req.body.email})
        .then(user=>{

            if(user)
                {
                    req.flash('error_msg','User already exists!');
                }
            else{
                
                const newUser={

                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                };
        
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password=hash;
                        new User(newUser).save()
                        .then(user=>{
                            req.flash('success_msg','User registered!');
                            res.redirect('/users/login');
                        })
                        .catch(err=>{
                            return;
                        });
                    });
                });
            }
        });    
    }
        
});

//user login form
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{

        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true,
    })(req,res,next);
});

//logout user
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','you are logged out');
    res.redirect('/users/login');
});
module.exports=router;

/*  */