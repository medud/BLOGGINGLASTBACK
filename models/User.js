const mongoose = require('mongoose');

// Schéma pour l'utilisateur
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // Ajoute d'autres champs ici si nécessaire
}, {
    timestamps: true // Ajoute les champs createdAt et updatedAt automatiquement
});

// Créer le modèle à partir du schéma
const User = mongoose.model('User', userSchema);

module.exports = User; // Exporter le modèle pour l'utiliser dans d'autres fichiers
