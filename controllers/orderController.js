const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    const { items, total } = req.body;
    try {
        const order = new Order({ items, total });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        // Récupérer les dates de début et de fin depuis les paramètres de la requête
        const { startDate, endDate } = req.query;

        // Vérifier si les dates sont fournies
        if (!startDate || !endDate) {
            return res.status(400).json({ error: "Les dates de début et de fin sont requises." });
        }

        // Convertir les dates en objets Date
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Filtrer les commandes dans la plage de dates
        const orders = await Order.find({
            date: {
                $gte: start, // Date supérieure ou égale à startDate
                $lte: end    // Date inférieure ou égale à endDate
            }
        }).sort({ date: -1 }); // Trier par date décroissante

        // Renvoyer les commandes filtrées
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};