const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    filename:{
        type:String,
        required:true,
    },
    path:{
        type:String,
        required:true,
    },
    size:{
        type:String,
        required:true,
    },
    uuid:{
        type:String,
        required:true,
    },
    sender:{
        type:String,
        required:false,
    },
    reciever:{
        type:String,
        required:false
    }
},{
    timestamps:true
});

module.exports = mongoose.model('file',schema);