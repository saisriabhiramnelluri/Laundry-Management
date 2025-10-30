require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Manager = require('./models/Manager');

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry';

async function seedData() {
    try {
        console.log('🔗 Connecting to MongoDB at', dbUrl);
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB successfully!');
        
        console.log('🧹 Clearing existing data...');
        await Student.deleteMany({});
        await Manager.deleteMany({});
        
        console.log('👨‍🎓 Creating test student...');
        const testStudent = new Student({
            name: 'John Doe',
            email: 'john.doe@college.edu',
            password: 'password123',
            hostel: 'Block A',
            roomNumber: '201',
            phone: '9876543210'
        });
        await testStudent.save();
        
        console.log('👨‍💼 Creating test manager...');
        const testManager = new Manager({
            name: 'Manager Smith',
            email: 'manager@college.edu',
            password: 'manager123'
        });
        await testManager.save();
        
        console.log('🎉 Seed data created successfully!');
        console.log('');
        console.log('🔑 Test Login Credentials:');
        console.log('📧 Student: john.doe@college.edu / password123');
        console.log('🔧 Manager: manager@college.edu / manager123');
        console.log('');
        
    } catch (error) {
        console.error('❌ Error seeding data:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

seedData();
