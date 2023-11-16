const express = require('express');
const KillBot = require('killbot.to');

const app = express();

// Replace 'your_api_key' with your actual API key from KillBot.to
// Replace 'your_config' with your actual config name
const apiKey = 'your_api_key';
const config = 'your_config';
const killBot = new KillBot(apiKey, config);

app.get('/', (req, res) => {
    killBot.checkReq(req)
        .then(result => {
            if (result.block) {
                // Block the user
                res.status(403).json({ message: 'Access denied' });
            } else {
                // Allow the user
                let location = result.IPlocation; //Get IP Location
                res.json({ message: 'Welcome', location: location });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
