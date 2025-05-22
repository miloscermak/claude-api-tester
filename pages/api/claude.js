export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { apiKey, model, message } = req.body;
        
        if (!apiKey || !model || !message) {
            return res.status(400).json({ error: 'Chybí parametry' });
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model,
                max_tokens: 1024,
                messages: [{ role: 'user', content: message }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json({ 
                error: error.error?.message || 'API chyba' 
            });
        }

        const data = await response.json();
        return res.status(200).json({ content: data.content[0].text });
        
    } catch (error) {
        return res.status(500).json({ error: 'Server error: ' + error.message });
    }
}
