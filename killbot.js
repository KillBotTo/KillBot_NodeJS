const https = require('https');

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
        const url = `https://killbot.to/api/antiBots/${this.apiKey}/check?config=${this.config}&ip=${ip}&ua=${encodedUserAgent}`;
        return await this.httpGet(url);
    }

    /**
     * Validates an IP address against IPv4 and IPv6 patterns.
     * @param {string} ip - The IP address to validate.
     * @returns {boolean} True if the IP address is valid (either IPv4 or IPv6), false otherwise.
     */
    isValidIp(ip) {
        const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex = /^([\da-fA-F]{1,4}:){7}([\da-fA-F]{1,4}|:)|::([\da-fA-F]{1,4}:){0,5}([\da-fA-F]{1,4}|:)(?!.*::.*::)|([\da-fA-F]{1,4}:){1,6}:$/;
        return ipv4Regex.test(ip) || ipv6Regex.test(ip);
    }

    /**
     * Checks if an IP address is considered local (private network IP).
     * This includes IPv4 loopback, private network ranges, and IPv6 local addresses.
     * @param {string} ip - The IP address to check.
     * @returns {boolean} True if the IP is local, false otherwise.
     */
    isLocalIp(ip) {
        const localIpv4Patterns = [
            /^127\./,        // IPv4 loopback
            /^10\./,         // IPv4 private network (10.0.0.0 - 10.255.255.255)
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // IPv4 private network (172.16.0.0 - 172.31.255.255)
            /^192\.168\./    // IPv4 private network (192.168.0.0 - 192.168.255.255)
        ];

        const localIpv6Patterns = [
            /^::1$/,             // IPv6 loopback
            /^fc00:/,            // IPv6 unique local address
            /^fd00:/             // IPv6 unique local address
        ];

        return localIpv4Patterns.some(pattern => pattern.test(ip)) || localIpv6Patterns.some(pattern => pattern.test(ip));
    }

    /**
     * Makes an HTTP GET request to a specified URL and returns the JSON-parsed response.
     * Handles errors during the HTTP request or while parsing the response.
     * @param {string} url - The URL to which the GET request is made.
     * @returns {Promise<object>} A promise that resolves to the parsed JSON response or rejects with an error.
     */
    async httpGet(url) {
        return new Promise((resolve, reject) => {
            const options = { headers: { 'User-Agent': 'KillBot.to Blocker-NodeJS' }};
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
}

module.exports = KillBot;