const express = require('express');
const axios = require('axios');
const os = require('os');
const osUtils = require('os-utils');
const app = express();

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

// Endpoint to fetch tweets using Bearer Token authentication
app.get('/tweets', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const token = process.env.BEARER_TOKEN; // Get bearer token from environment variable (IN Heroku)

        // Set up request headers with Bearer Token
        const headers = {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'v2RecentSearchJS' // User Agent - as required by the API
        };

        // Make request to Twitter API v2
        const response = await axios.get(`https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}`, {
            headers: headers
        });

        // Extract necessary information and format the response
        const tweets = response.data.data.map(tweet => {
            return {
                id: tweet.id,
                text: tweet.text,
            };
        });

        // Return only the 10 latest tweets
        res.json(tweets.slice(0, 10));
    } catch (error) {
        console.error('Error fetching tweets:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch tweets' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
