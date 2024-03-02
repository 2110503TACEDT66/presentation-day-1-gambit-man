const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    BookingDate: {
        type: Date,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        unique: true,
        required:[true,'Please add an User']
    },
    provider:{
        type:mongoose.Schema.ObjectId,
        ref: 'Booking',
        unique: true,
        required:[true,'Please add an provider']
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Booking',BookingSchema);



//2023-05-15T17:00:00.000Z
//65d7059d1390bf7d394238d1 hospital
//65d6b8ccbe4da502578dae37 user