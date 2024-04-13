const express = require('express');
const axios = require('axios');
const os = require('os');
const osUtils = require('os-utils');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

const app = express();

// Initialize OAuth1 credentials
const oauth = OAuth({
    consumer: {
        key: '6OqdZP3BIJ0Li50irXBdgpFrV',
        secret: 'PL7dLOq8Lvw0oVns1OfHbSlOiyH5fZ3LmHRsR7AJ5DdgWoZJqG'
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
});

// GET /health endpoint
app.get('/health', (req, res) => {
    try {
        const osName = os.platform();
        const nodeVersion = process.version;
        const memUsage = {
            total: os.totalmem(),
            free: os.freemem(),
            used: os.totalmem() - os.freemem()
        };

        // Get CPU usage
        let cpuUsage;
        osUtils.cpuUsage((usage) => {
            cpuUsage = usage * 100; // Convert from fraction to percentage

            res.json({
                osName,
                nodeVersion,
                memoryUsage: memUsage.used / memUsage.total * 100,
                cpuUsage: cpuUsage
            });
        });
    } catch (error) {
        console.error('Error fetching system information:', error);
        res.status(500).json({error: 'Failed to fetch system information'});
    }
});

// Endpoint to fetch tweets using OAuth1 authentication
app.get('/tweets', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({error: 'Query parameter is required'});
        }

        // Generate OAuth1 headers
        const requestData = {
            url: `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}`,
            method: 'GET',
        };
        const authHeader = oauth.toHeader(oauth.authorize(requestData));

        // Make request with OAuth1 headers
        const response = await axios.get(requestData.url, {
            headers: {
                ...authHeader
            }
        });

        // Extract necessary information and format the response
        const tweets = response.data.data.map(tweet => {
            return {
                id: tweet.id,
                text: tweet.text,
                // Add more fields as needed
            };
        });

        // Return only the 10 latest tweets
        res.json(tweets.slice(0, 10));
    } catch (error) {
        console.error('Error fetching tweets:', error.response ? error.response.data : error.message);
        res.status(500).json({error: 'Failed to fetch tweets'});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
