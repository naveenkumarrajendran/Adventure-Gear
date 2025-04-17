const jwt = require('jsonwebtoken');

const user = {

  role: "admin" 
};

const secretKey = "3849549d4c7797ccfbe20a719774a1418f9f3efeea7d155842288d3386de5736"; 

const token = jwt.sign(user, secretKey, { expiresIn: "1h" });

console.log("Generated JWT Token:", token);