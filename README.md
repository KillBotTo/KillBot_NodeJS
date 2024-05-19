# KillBot.to NodeJS AntiBot

KillBot is a Node.js module for checking and blocking potentially malicious requests based on IP and User-Agent information. It allows you to check whether your users are potentially malicious and, at the same time, retrieve information such as their location. Use of this module requires an API key and a subscription to the [KillBot.To Antibot](https://killbot.to/subscriptions) website.
You can review our [Killbot antibot documentation](https://documentation.killbot.to/).

## Installation

Use the package manager npm to install KillBot.To.

```bash
npm install killbot.to -s
```

## Usage
### Method 1: Using Express Middleware

```javascript
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

```

### Method 2: Manually providing IP and User-Agen
```javascript
const KillBot = require('killbot.to'); // Ensure this points to your KillBot file

const apiKey = 'your_api_key'; // Replace with your actual KillBot.to API key
const config = 'default'; // Or your actual config name
const killBot = new KillBot(apiKey, config);

const userIP = '1.1.1.1'; // Replace with the user's IP
const userAgent = 'Mozilla/5.0 ...'; // Replace with the user's User-Agent

killBot.check(userIP, userAgent)
.then(result => {
    let location = result.IPlocation;
    console.log('Check result:', result);
    if (result.block) {
        console.log('Block the user');
    } else {
        console.log('Allow the user');
    }
})
.catch(error => {
    console.error('Error:', error);
});

```

Replace 'your_api_key' with your actual API key from KillBot.to in both methods.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
