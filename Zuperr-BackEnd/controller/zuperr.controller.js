
const zuperrController = (req,res) =>{
    try{
        res.status(200).send({message:"Welcome to Zuperr!"});
    }catch(error){
        console.log(error);
    }
}

module.exports = {zuperrController}