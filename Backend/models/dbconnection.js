const mongoose = require('mongoose')

const mongooseConnect = ()=>{
mongoose.connect(process.env.db,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(()=>{console.log('connected to db')})
.catch((err)=>{'could not connect to mongodb',err})
mongoose.set('debug', true);
//process.exit(1);
}


module.exports = mongooseConnect;

