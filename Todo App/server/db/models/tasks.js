const mongoose=require('mongoose')


const taskschema=new mongoose.Schema({
    username:
    {
        type:String,
 required:true,
    trim:true
},
task:
{type:String,
    trim:true}
,
    time:String,
    assigned:Boolean,
    
    status:
    {
        type:String,
        reuired:true,
    },
desc:String,
deldesc:String,
deltime:String,
FromStatus:String,
date:String


})
const UserTasks=new mongoose.model('UserTasks',taskschema);
module.exports= UserTasks;