const express = require('express');
const KillBot = require('killbot.to');

const app = express();

// Replace 'your_api_key' with your actual API key from KillBot.to
const apiKey = 'your_api_key';
const killBot = new KillBot(apiKey);

app.get('/', (req, res) => {
    killBot.checkReq(req)
        .then(result => {
            let location = result.IPlocation; //Get IP Location
            if (result.block) {
                // Block the user
                res.status(403).json({ message: 'Access denied' }); //Block access to malicious user
            } else {
                // Allow the user
                res.json({ message: 'Welcome' });
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
