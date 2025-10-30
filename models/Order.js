const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    clothesCount: { type: Number, required: true },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'washing', 'ready', 'completed'], default: 'pending' },
    qrCode: { type: String }, 
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
    }],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
