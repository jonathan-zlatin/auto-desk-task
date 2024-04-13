// const axios = require('axios');

// Replace these values with your actual Twitter API credentials
const consumerKey = '6OqdZP3BIJ0Li50irXBdgpFrV';
const consumerSecret = 'PL7dLOq8Lvw0oVns1OfHbSlOiyH5fZ3LmHRsR7AJ5DdgWoZJqG';
const accessToken = '1778520124963885057-7kijq8AjprkL64dvcFEKwnPB3yJaFg';
const accessTokenSecret = 'F9qpMku4MyR5tzCTj0MpL3h8v8P5LO86VNa85Do1ufGHG';

const OAuth = require('oauth-1.0a');
// Create an OAuth1 instance
const oauth = OAuth({
    consumer: {
        key: consumerKey,
        secret: consumerSecret
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return require('crypto').createHmac('sha1', key).update(base_string).digest('base64');
    }
});

// Endpoint to fetch tweets
app.get('/tweets', async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        // Prepare OAuth1 request options
        const requestData = {
            url: `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}`,
            method: 'GET',
            data: {} // Twitter API v2 does not require additional data for OAuth1
        };

        // Generate OAuth1 Authorization header
        const authorization = oauth.authorize(requestData, {
            key: accessToken,
            secret: accessTokenSecret
        });

        // Include Authorization header in the request
        const response = await axios.get(requestData.url, {
            headers: oauth.toHeader(authorization)
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
        res.status(500).json({ error: 'Failed to fetch tweets' });
    }
});