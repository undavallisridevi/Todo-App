

const mongoose=require('mongoose')
const uri = 'mongodb+srv://Sridevi:Sridevi33@cluster0.ftigaci.mongodb.net/Todo?retryWrites=true&w=majority'
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