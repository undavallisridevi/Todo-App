

const mongoose=require('mongoose')
const uri = 'mongodb://127.0.0.1:27017/todo'
const connectdb = async()=>{
    try{
const con= await mongoose.connect(uri,{
    useNewUrlParser:true,
   
   
    useUnifiedTopology: true,
    
   
});


console.log(`Mongo Db Connected: ${con.connection.host}`);
}
catch(err){
    console.log(err);
}
}
module.exports=connectdb