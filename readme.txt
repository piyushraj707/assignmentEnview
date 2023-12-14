make a post request using postman as:

Body > raw > JSON:
{
    "timestamp": "1000",
    "is_driving_safe": 0,
    "vehicle_id": 102,
    "location_type": "highway"
}

Run npm install to install express and nodemon
Run the server as: nodemon server.js or node server.js