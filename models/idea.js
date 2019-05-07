const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/vidjot', { useNewUrlParser: true })
.then(()=>console.log('Connected'))
.catch(err=>console.log('Couldn\'t connect',err));


//creating schema
const ideaSchema=new mongoose.Schema({
    
    date:{
        type:Date,
        default:Date.now()
    },
    title:{
        type:String,
        required:true
    },
    description:String,
    user:{
        type:String,
        required:true
    }
});

mongoose.model('ideas',ideaSchema);


