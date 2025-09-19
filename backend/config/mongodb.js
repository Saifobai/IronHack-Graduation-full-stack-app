const mongoose = require('mongoose');

const connectToDb = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('✅ Connected to Database');
        });

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectToDb;
