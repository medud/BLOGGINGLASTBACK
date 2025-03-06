const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connecté à MongoDB Atlas");
    } catch (err) {
        console.error("❌ Erreur de connexion à MongoDB :", err);
        process.exit(1);
    }
};

module.exports = connectDB;
