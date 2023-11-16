const https = require('https');

class KillBot {
    /**
     * Constructor to initialize the KillBot instance with an API key and optional config
     * @param {string} apiKey - The API key for accessing the KillBot service.
     * @param {string} [config='default'] - Optional configuration name.
     */
    constructor(apiKey, config = 'default') {
        this.apiKey = apiKey;
        this.config = config;
    }

    /**
     * Extracts IP and User-Agent from a request object
     * @param {object} req - The request object from which to extract information.
     * @returns {object} An object containing the IP address and User-Agent.
     */
    extractInfoFromReq(req) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        return { ip, userAgent };
    }

    /**
     * Checks if a request should be blocked using the KillBot service
     * @param {object} req - The request object to check.
     * @returns {Promise<object>} A promise that resolves to the response from KillBot.
     */
    async checkReq(req) {
        const { ip, userAgent } = this.extractInfoFromReq(req);
        return this.check(ip, userAgent);
    }

    /**
     * Main method to check if an IP/User-Agent should be blocked
     * @param {string} ip - The IP address to check.
     * @param {string} userAgent - The User-Agent string to check.
     * @returns {Promise<object>} A promise that resolves to the response from KillBot.
     */
    async check(ip, userAgent) {
        try {
            const encodedUserAgent = encodeURIComponent(userAgent);
            const url = `https://killbot.to/api/antiBots/${this.apiKey}/check?config=${this.config}&ip=${ip}&ua=${encodedUserAgent}`;
            const response = await this.httpGet(url);
            if (!response) {
                return { block: false };
            }
            return JSON.parse(response);
        } catch (error) {
            return { block: false, error: error.message };
        }
    }

    /**
     * Performs an HTTP GET request
     * @param {string} url - The URL to which the request is sent.
     * @returns {Promise<string>} A promise that resolves to the response body as a string.
     */
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
