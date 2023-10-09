# KillBot.to NodeJS AntiBot

KillBot is a Node.js module for checking and blocking potentially malicious requests based on IP and User-Agent information. It allows you to check whether your users are potentially malicious and, at the same time, retrieve information such as their location. Use of this module requires an API key and a subscription to the [KillBot.To](https://killbot.to/subscriptions) website

## Installation

Use the package manager [KillBot.To](https://killbot.to/subscriptions) to install foobar.

```bash
npm install killbot -s
```

## Usage
### Method 1: Using Express Middleware

## Usage
To use KillBot in your project, you can install it via npm:
```bash
npm install killbot -s
```
### Method 1: Using Express Middleware

```javascript
const express = require('express');
const KillBot = require('killbot');

const app = express();

// Replace 'your_api_key' with your actual API key from KillBot.to
const apiKey = 'your_api_key';
const killBot = new KillBot(apiKey);

app.get('/', (req, res) => {
    killBot.checkReq(req)
        .then(result => {
            if (result.block) {
                // Block the user
                let location = result.IPlocation; //Get IP Location
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
```

### Method 2: Manually providing IP and User-Agen
```javascript
const KillBot = require('killbot');

// Replace 'your_api_key' with your actual API key from KillBot.to
const apiKey = 'your_api_key';
const killBot = new KillBot(apiKey);

const userIP = '192.168.0.1'; // Replace with the user's IP
const userAgent = 'Mozilla/5.0 ...'; // Replace with the user's User-Agent

killBot.check(userIP, userAgent)
    .then(result => {
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
