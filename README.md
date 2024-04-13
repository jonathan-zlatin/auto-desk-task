# Jonathan Zlaitn - Autodesk Intern Home Assignment

Welcome to the Autodesk Intern Home Assignment project. This project implements a simple service with two endpoints and is deployed to Heroku with a Docker container.

## Live API Endpoint

You can access the live API endpoint here: [Auto-Desk-Home-Task](https://auto-desk-home-task-d4ed3dcb423c.herokuapp.com/)

## Endpoints

### 1. GET /tweets?query=YOUR_STRING

This endpoint retrieves the 10 latest tweets from Twitter API based on the provided query string.

#### Example Usage:
```
GET https://auto-desk-home-task-d4ed3dcb423c.herokuapp.com/tweets?query=football
```

### 2. GET /health

This endpoint provides a health check of the service, including system information such as OS name, Node.js version, memory usage, and CPU usage.

#### Example Usage:
```
GET https://auto-desk-home-task-d4ed3dcb423c.herokuapp.com/health
```

## How to Run Locally with Docker

1. Clone the GitHub repository:
   ```
   git clone https://github.com/jonathan-zlatin/auto-desk-task.git
   ```

2. Navigate to the project directory:
   ```
   cd auto-desk-task
   ```

3. Build the Docker image:
   ```
   docker build -t auto-desk-task .
   ```

4. Run the Docker container:
   ```
   docker run -p 3000:3000 auto-desk-task
   ```

5. Access the API endpoints:
   - Tweets: `http://localhost:3000/tweets?query=YOUR_STRING`
   - Health: `http://localhost:3000/health`

## GitHub Repository

The code for this project is hosted on GitHub: [auto-desk-task](https://github.com/jonathan-zlatin/auto-desk-task)

## Dependencies

- axios: ^0.24.0
- express: ^4.17.1
- os-utils: ^0.0.14

---

Make sure to replace `YOUR_STRING` in the API endpoint URLs with the desired query string.

If you have any questions or need further assistance, feel free to reach out!
