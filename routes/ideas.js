const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const {ensureAuthenticated}=require('../helpers/auth');

//loading idea model
require('../models/idea');
const Idea=mongoose.model('ideas');

//ideas page
router.get('/',ensureAuthenticated,(req,res)=>{

    Idea.find({user:req.user.id}).sort({date:'desc'})
    .then(ideas=>{

        res.render('ideas/ideaPage',{

            ideas:ideas
        });
    });   
});

//add idea form 
router.get('/add',ensureAuthenticated,(req, res )=>{

    res.render('ideas/add');
});

//edit idea page
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Idea.findById(req.params.id)
    .then(idea => {
        if(idea.user!=req.user.id){
            req.flash('error_msg','Not authorised');
            req.redirect('/ideas');
        }
        else{
            res.render('ideas/edit',{

                idea:idea
            });
        }
    });
                                                                      
});

//process form 
router.post('/',ensureAuthenticated,(req,res)=>{

    var errors=[];

    if(!req.body.details){

        errors.push({text:'Please add some details'});
    }
    if(!req.body.title){

        errors.push({text:'Please add title'});
    }

    if(errors.length>0){

        res.render('ideas/add',{

            errors:errors,
            title:req.body.title,
            details:req.body.details,
        });
    }
    else{

        const newIdea={

            title:req.body.title,
            description:req.body.details,
            user:req.user.id
        };
        new Idea(newIdea).save().then(idea=>{
            req.flash('success_msg','Idea added!');
            res.redirect('/ideas');
        });
    }
});


//process edit form 
router.put('/:id',ensureAuthenticated,(req,res)=>{

    Idea.findOne({

        _id:req.params.id
    })
    .then(idea => {

        idea.title =req.body.title;
        idea.description=req.body.details;

        idea.save()
        .then(()=>{

            req.flash('success_msg','Idea updated!');
            res.redirect('/ideas');
        });
    });
});

//delete idea 
router.delete('/:id',ensureAuthenticated,(req,res)=>{
    Idea.findByIdAndRemove(req.params.id)
        .then(idea => {
            req.flash('success_msg', 'Sucessfully deleted!');
            res.redirect('/ideas');
        });                                                                         
});


module.exports=router;