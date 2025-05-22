export default function handler(req, res) {
    res.status(200).json({ 
        message: 'API funguje!', 
        method: req.method,
        timestamp: new Date().toISOString()
    });
}
