const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        // Vérifier les erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, phone, password } = req.body;

        // Vérifier que toutes les valeurs sont bien fournies
        if (!username || !phone || !password) {
            return res.status(400).json({ error: "Tous les champs sont requis." });
        }

        console.log("🔍 Données reçues pour inscription :", { username, phone, password });

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Ce nom d'utilisateur existe déjà." });
        }

        // Hash du mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Créer et sauvegarder l'utilisateur
        const user = new User({ username, phone, password: hashedPassword });
        await user.save();

        console.log("✅ Utilisateur créé avec succès :", user);

        res.status(201).json({ message: "Utilisateur créé avec succès.", user });
    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de l'inscription." });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Vérifier que toutes les valeurs sont bien fournies
        if (!username || !password) {
            return res.status(400).json({ error: "Nom d'utilisateur et mot de passe requis." });
        }

        console.log("🔍 Tentative de connexion :", { username, password });

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Identifiants invalides." });
        }

        // Comparer le mot de passe fourni avec celui en base de données
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Identifiants invalides." });
        }

        // Générer un token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log("✅ Connexion réussie. Token généré :", token);

        res.json({ message: "Connexion réussie.", token });
    } catch (error) {
        console.error("❌ Erreur lors de la connexion :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la connexion." });
    }
};
