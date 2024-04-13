const request = require('supertest');
const app = require('./main');

// Test suite for API endpoints
describe('API Endpoints', () => {

    // Test suite for GET /tweets endpoint
    describe('GET /tweets', () => {

        // Test case: should return the 10 latest tweets for a valid query
        it('should return the 10 latest tweets for a valid query', async () => {
            const query = 'football'; // Example query string
            const response = await request(app).get(`/tweets?query=${query}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
            expect(response.data.length).toBe(10);

            // Additional checks for each tweet in the response
            response.data.forEach(tweet => {
                expect(tweet.id).toBeDefined();
                expect(tweet.text).toBeDefined();
            });
        });

        // Test case: should return a 400 error for missing query parameter
        it('should return a 400 error for missing query parameter', async () => {
            try {
                const response = await request(app).get('/tweets');
            } catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data.error).toBe('Query parameter is required');
            }
        });
    });

    // Test suite for GET /health endpoint
    describe('GET /health', () => {

        // Test case: should return system health information
        it('should return system health information', async () => {
            const response = await request(app).get('/health');
            expect(response.status).toBe(200);
            // Additional checks for system health properties
            expect(response.body.osName).toBeDefined();
            expect(response.body.nodeVersion).toBeDefined();
            expect(response.body.memoryUsage).toBeGreaterThanOrEqual(0);
            expect(response.body.memoryUsage).toBeLessThanOrEqual(100);
            expect(response.body.cpuUsage).toBeGreaterThanOrEqual(0);
            expect(response.body.cpuUsage).toBeLessThanOrEqual(100);
        });
    });
});
