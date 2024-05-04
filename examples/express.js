const express = require('express');
const KillBot = require('killbot.to'); // Ensure this points to your KillBot file

const app = express();
const apiKey = 'your_api_key'; // Replace with your actual KillBot.to API key
const config = 'default'; // Or your actual config name
const killBot = new KillBot(apiKey, config);

app.get('/', async (req, res) => {
    try {
        const result = await killBot.checkReq(req);
        let location = result.IPlocation; // Get IP Location
        if (result.block) {
            res.status(403).json({ message: 'Access denied' });
        } else {
            res.json({ message: 'Welcome', location: location });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.listen(80, () => {
    console.log('Server is listening on port 80');
});
