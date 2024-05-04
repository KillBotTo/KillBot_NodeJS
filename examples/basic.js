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