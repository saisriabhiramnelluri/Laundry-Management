const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hostel: { type: String, required: true },
    roomNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    totalOrders: { type: Number, default: 0 },
    firstOrderDate: { type: Date },
    lastOrderDate: { type: Date },
}, { timestamps: true });

studentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('Student', studentSchema);
