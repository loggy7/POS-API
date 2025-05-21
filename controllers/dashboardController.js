const Order = require('../models/Order');

// Fonction pour récupérer les données horaires
const hourlyData = async (req, res) => {
  try {
    // Récupérer les données horaires depuis la base de données
    const hourlyData = await Order.find({}).sort({ hour: 1 }); // Trier par heure

    // Si aucune donnée n'est trouvée
    if (hourlyData.length === 0) {
      return res.status(404).json({ message: 'Aucune donnée de commande trouvée' });
    }

    // Répondre avec les données sous forme de JSON
    res.json(hourlyData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Fonction pour obtenir la plage de dates
const getDateRange = (startDate, endDate) => {
  // Si les dates ne sont pas définies, prendre par défaut la date d'aujourd'hui
  const start = startDate ? new Date(startDate) : new Date(new Date().setHours(0, 0, 0, 0)); // Définir la date de début à minuit aujourd'hui si non précisé
  const end = endDate ? new Date(endDate) : new Date(); // Utiliser la date actuelle comme date de fin
  return { start, end };
};

// Fonction pour récupérer les données horaires filtrées par plage de dates ou du jour par défaut
const getFilteredHourlyData = async (req, res) => {
  try {
    // Récupérer les dates de début et de fin depuis la requête
    const { startDate, endDate } = req.query;
    
    // Si aucune plage de dates n'est spécifiée, récupérer les données du jour actuel par défaut
    const { start, end } = getDateRange(startDate, endDate);

    // Filtrer les données directement depuis la base de données
    const hourlyData = await Order.find({
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    // Si aucune donnée n'est trouvée
    if (hourlyData.length === 0) {
      return res.status(404).json({ message: 'Aucune donnée de commande trouvée dans la plage de dates spécifiée' });
    }

    // Répondre avec les données filtrées
    res.json(hourlyData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// Fonction pour supprimer les commandes dans une plage de dates
const deleteOrdersByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Si les dates de début ou de fin sont manquantes, renvoyer une erreur
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Les dates de début et de fin sont nécessaires." });
    }

    // Récupérer les dates de début et de fin
    const { start, end } = getDateRange(startDate, endDate);

    // Supprimer les commandes dans la plage de dates spécifiée
    const result = await Order.deleteMany({
      date: { $gte: start, $lte: end },
    });

    // Vérification si des commandes ont été supprimées
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Aucune commande trouvée dans cette plage de dates." });
    }

    // Retourner le nombre de commandes supprimées
    res.status(200).json({ message: `${result.deletedCount} commande(s) supprimée(s).` });
  } catch (error) {
    console.error('Erreur lors de la suppression des commandes:', error);
    res.status(500).json({ message: "Une erreur est survenue lors de la suppression des commandes.", error: error.message });
  }
};

// Fonction pour récupérer les ventes totales sur une période
const getTotalSales = async (start, end) => {
  const orders = await Order.find({
    date: { $gte: start, $lte: end },
  });
  return orders.reduce((total, order) => total + order.total, 0);
};

// Fonction pour récupérer le nombre total de commandes sur une période
const getOrderCount = async (start, end) => {
  return await Order.countDocuments({
    date: { $gte: start, $lte: end },
  });
};

// Fonction pour récupérer le nombre de clients distincts sur une période
const getDistinctCustomersCount = async (start, end) => {
  return await Order.countDocuments({
    date: { $gte: start, $lte: end },
  });
};

// Fonction pour récupérer la valeur moyenne du panier sur une période
const getAvgBasketValue = async (start, end) => {
  const orders = await Order.find({
    date: { $gte: start, $lte: end },
  });
  const totalSales = orders.reduce((total, order) => total + order.total, 0);
  return orders.length > 0 ? totalSales / orders.length : 0;
};

// Fonction pour récupérer les commandes récentes
const getRecentOrders = async (start, end, limit = 4) => {
  return await Order.find({
    date: { $gte: start, $lte: end },
  })
    .sort({ date: -1 })
    .limit(limit);
};

// Fonction pour récupérer le nombre de commandes par heure
const getOrdersByHour = async (start, end) => {
  const orders = await Order.find({
    date: { $gte: start, $lte: end },
  });

  const ordersByHour = Array(24).fill(0); // Tableau de 24 heures initialisé à 0

  orders.forEach(order => {
    const orderDate = new Date(order.date);
    const hour = orderDate.getHours(); // Utilise getHours pour l'heure locale de l'utilisateur
    ordersByHour[hour]++; // Incrémenter le nombre de commandes pour cette heure
  });

  return ordersByHour;
};



module.exports = {
  deleteOrdersByDateRange,
  getDateRange,
  getFilteredHourlyData,
  getTotalSales,
  getOrderCount,
  getDistinctCustomersCount,
  getAvgBasketValue,
  getRecentOrders,
  getOrdersByHour,
  hourlyData,
};