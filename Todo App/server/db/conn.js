

const mongoose=require('mongoose')
const uri = process.env.MONGO_URI;
const connectdb = async()=>{
    try{
 mongoose.connect(uri,{
    useNewUrlParser:true,
   
   
    useUnifiedTopology: true,
    
    
});

console.log("Mongo Db Connected");

}
catch(err){
    console.log(err);
}
}

module.exports=connectdb