const https = require('https');

class KillBot {
    // Constructor to initialize the KillBot instance with an API key
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    // Method to extract IP and User-Agent from the request
    extractInfoFromReq(req) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        return { ip, userAgent };
    }

    // Method to check using the extracted information from the request
    async checkReq(req) {
        const { ip, userAgent } = this.extractInfoFromReq(req);
        return this.check(ip, userAgent);
    }

    // Main method to check by providing IP and User-Agent
    async check(ip, userAgent) {
        try {
            // Encode the User-Agent to be included in the URL
            const encodedUserAgent = encodeURIComponent(userAgent);
            // Construct the URL for the API call
            const url = `https://killbot.to/api/antiBots/${this.apiKey}/check?ip=${ip}&ua=${encodedUserAgent}`;
            // Perform an HTTP GET request
            const response = await this.httpGet(url);
            // If there's no response, assume no blocking is needed
            if (!response) {
                return { block: false };
            }
            // Parse the response as JSON
            return JSON.parse(response);
        } catch (error) {
            // If an error occurs, assume no blocking is needed and include the error message
            return { block: false, error: error.message };
        }
    }

    // Method to perform an HTTP GET request
    async httpGet(url) {
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    'User-Agent': 'KillBot.to Blocker-NodeJS'
                }
            };

            const req = https.get(url, options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    resolve(data);
                });
            });

            req.on('error', (e) => {
                reject(e);
            });
        });
    }
}

module.exports = KillBot;
