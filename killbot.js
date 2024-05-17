const https = require('https');
const net = require('net');

class KillBot {
    /**
     * Constructor for the KillBot class that initializes with an API key and configuration.
     * @param {string} apiKey - The API key necessary to access the remote KillBot service.
     * @param {string} [config='default'] - Optional configuration string used in the API request.
     */
    constructor(apiKey, config = 'default') {
        this.apiKey = apiKey;
        this.config = config;
    }

    /**
     * Extracts the IP address and User-Agent from an HTTP request object.
     * This method handles IPv4 and IPv4-mapped IPv6 addresses.
     * @param {object} req - The HTTP request object from which to extract the IP and User-Agent.
     * @returns {object} An object containing the IP address and User-Agent string.
     */
    extractInfoFromReq(req) {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // Normalize IP address by extracting IPv4 from IPv4-mapped IPv6 if present
        ip = ip.replace(/^.*:/, '');
        const userAgent = req.headers['user-agent'];
        return { ip, userAgent };
    }

    /**
     * Processes an HTTP request object to check if it should be blocked based on IP and User-Agent.
     * @param {object} req - The request object to be checked.
     * @returns {Promise<object>} A promise that resolves to the blocking decision.
     */
    async checkReq(req) {
        const { ip, userAgent } = this.extractInfoFromReq(req);
        return await this.check(ip, userAgent);
    }

    /**
     * Checks if the IP and User-Agent should be blocked by consulting the KillBot API.
     * Throws errors if the IP address is invalid or local.
     * @param {string} ip - The IP address to check.
     * @param {string} userAgent - The User-Agent string to check.
     * @returns {Promise<object>} A promise that resolves to the API's response.
     */
    async check(ip, userAgent) {
        if (this.isLocalIp(ip)) {
            throw new Error("Local IP addresses are not processed.");
        }
        if (!this.isValidIp(ip)) {
            throw new Error("Invalid IP address provided.");
        }
        const encodedUserAgent = encodeURIComponent(userAgent);
        const url = `https://api.killbot.to/check?config=${this.config}&ip=${ip}&ua=${encodedUserAgent}`;
        return await this.httpGet(url);
    }

    /**
     * Makes an HTTP GET request to a specified URL and returns the JSON-parsed response.
     * Adjusted to include the API key in the header.
     * @param {string} url - The URL to which the GET request is made.
     * @returns {Promise<object>} A promise that resolves to the parsed JSON response or rejects with an error.
     */
    async httpGet(url) {
        return new Promise((resolve, reject) => {
            const options = {
                headers: {
                    'User-Agent': 'KillBot.to Blocker-NodeJS',
                    'X-API-Key': this.apiKey
                }
            };
            https.get(url, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        if (response.success === false) {
                            reject(new Error('Killbot.to error: ' + response.error));
                        }
                        resolve(response);
                    } catch (err) {
                        reject(new Error('Killbot.to error: ' + err.message));
                    }
                });
            }).on('error', e => reject(new Error('Killbot.to error: ' + e.message)));
        });
    }

    /**
     * Retrieves the usage statistics of the KillBot API.
     * Updated the URL to match the new base path.
     * @returns {Promise<object>} A promise that resolves to the API's usage statistics.
     */
    async getUsage() {
        try {
            const response = await this.httpGet(`https://api.killbot.to/getUsages`);
            return response; // Already parsed in httpGet
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * Checks if an IP address is local.
     * @param {string} ip - The IP address to check.
     * @returns {boolean} True if the IP is local, false otherwise.
     */
    isLocalIp(ip) {
        // Define local IP ranges
        const localRanges = [
            /^127\./, // 127.0.0.0/8
            /^10\./, // 10.0.0.0/8
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
            /^192\.168\./, // 192.168.0.0/16
            /^::1$/, // Loopback IPv6
            /^fc00:/, // Unique local address IPv6
            /^fe80:/ // Link-local address IPv6
        ];

        return localRanges.some((range) => range.test(ip));
    }

    /**
     * Validates if an IP address is valid.
     * @param {string} ip - The IP address to validate.
     * @returns {boolean} True if the IP address is valid, false otherwise.
     */
    isValidIp(ip) {
        return net.isIP(ip) !== 0;
    }
}

module.exports = KillBot;
