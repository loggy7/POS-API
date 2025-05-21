const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');  


// Route pour récupérer les données horaires
router.get('/hourly-data', dashboardController.hourlyData);

// Route pour récupérer les données horaires filtrées par plage de dates
router.get('/hourly-data/date-range', dashboardController.getFilteredHourlyData);

// Route pour récupérer les ventes totales sur une période donnée
router.get('/sales', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = dashboardController.getDateRange(startDate, endDate);
    
    const totalSales = await dashboardController.getTotalSales(start, end);
    res.json({ totalSales });
  } catch (error) {
    console.error('Erreur lors de la récupération des ventes totales:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Route pour récupérer le nombre total de commandes sur une période donnée
router.get('/orders/count', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = dashboardController.getDateRange(startDate, endDate);
    
    const orderCount = await dashboardController.getOrderCount(start, end);
    res.json({ orderCount });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de commandes:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Route pour récupérer le nombre de clients distincts sur une période donnée
router.get('/customers/count', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = dashboardController.getDateRange(startDate, endDate);
    
    const distinctCustomersCount = await dashboardController.getDistinctCustomersCount(start, end);
    res.json({ distinctCustomersCount });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de clients distincts:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Route pour récupérer la valeur moyenne du panier sur une période donnée
router.get('/basket/average', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = dashboardController.getDateRange(startDate, endDate);
    
    const avgBasketValue = await dashboardController.getAvgBasketValue(start, end);
    res.json({ avgBasketValue });
  } catch (error) {
    console.error('Erreur lors de la récupération de la valeur moyenne du panier:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Route pour récupérer les commandes récentes
router.get('/orders/recent', async (req, res) => {
  try {
    const { startDate, endDate, limit = 4 } = req.query;
    const { start, end } = dashboardController.getDateRange(startDate, endDate);
    
    const recentOrders = await dashboardController.getRecentOrders(start, end, limit);
    res.json({ recentOrders });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes récentes:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Route pour récupérer le nombre de commandes par heure
router.get('/orders/hourly', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = dashboardController.getDateRange(startDate, endDate);
    
    const ordersByHour = await dashboardController.getOrdersByHour(start, end);
    res.json({ ordersByHour });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes par heure:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Route pour supprimer les commandes dans une plage de dates
router.delete('/clear', async (req, res) => {
  try {
    // Récupérer les dates de début et de fin de la requête
    const { startDate, endDate } = req.query;

    // Formater les dates de début et de fin (en utilisant la méthode getDateRange si nécessaire)
    const { start, end } = dashboardController.getDateRange(startDate, endDate);

    // Appeler la méthode pour supprimer les commandes dans la plage de dates
    const result = await dashboardController.deleteOrdersByDateRange(start, end);

    // Si tout s'est bien passé, répondre avec un message de succès
    res.json({ message: 'Commandes supprimées avec succès', result });
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse d'erreur avec un code HTTP 500
    console.error('Erreur lors de la suppression des commandes:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
