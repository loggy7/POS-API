const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ton modèle d'utilisateur (assurez-vous qu'il existe)

const auth = async (req, res, next) => {
  try {
    // Récupérer le token dans les en-têtes de la requête
    const token = req.header('Authorization')?.replace('Bearer ', ''); // L'en-tête Authorization est attendu sous le format 'Bearer <token>'
    
    if (!token) {
      return res.status(401).json({ error: 'Accès non autorisé. Veuillez vous connecter.' });
    }

    // Décoder le token et vérifier sa validité
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assurez-vous que la clé secrète JWT est stockée dans .env

    // Vérifier que l'utilisateur existe encore (par exemple, il n'a pas été supprimé)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé ou token invalide.' });
    }

    // Attacher l'utilisateur à la requête (utile pour l'accès dans le contrôleur)
    req.user = user;
    req.token = token; // Optionnel, mais parfois utile pour invalidation de token
    next(); // Passer au contrôleur suivant si tout est ok

  } catch (error) {
    res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
};

module.exports = auth;
