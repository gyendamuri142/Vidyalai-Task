import mongoose from 'mongoose';
const connection=()=>{
    const DB_URI=`mongodb://chinnu:chinnu123@ac-zi29ikb-shard-00-00.kcvfylt.mongodb.net:27017,ac-zi29ikb-shard-00-01.kcvfylt.mongodb.net:27017,ac-zi29ikb-shard-00-02.kcvfylt.mongodb.net:27017/?ssl=true&replicaSet=atlas-ciwkhc-shard-0&authSource=admin&retryWrites=true&w=majority&appName=pdf-editor`;
    try{
        mongoose.connect(DB_URI,{useNewUrlParser:true});
        console.log("sucess db");


    }catch(error){
        console.log("error is ",error.message);
    }
}
export default connection;