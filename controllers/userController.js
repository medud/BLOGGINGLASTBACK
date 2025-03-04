const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assure-toi que le modèle User existe

const JWT_SECRET = 'ton_secret_key'; // Change ça et utilise une variable d'environnement

// Route GET pour tester l'API
router.get('/', (req, res) => {
    res.send('Welcome to the user API');
});

// Route d'inscription
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (error) {
        console.error("Erreur d'inscription :", error);
        res.status(500).json({ message: "Erreur lors de l'inscription", error });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Données reçues :", email, password); // Vérifier les données entrantes

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Identifiants invalides" });
        }

        console.log("Mot de passe en BD :", user.password); // Vérifier le hash du mot de passe

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Identifiants invalides" });
        }

        // Générer un token JWT
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Connexion réussie", token });
    } catch (error) {
        console.error("Erreur de connexion :", error);
        res.status(500).json({ message: "Erreur lors de la connexion", error });
    }
});

module.exports = router;
