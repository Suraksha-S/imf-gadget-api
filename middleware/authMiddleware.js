const jwt = require('jsonwebtoken');

const protect = (req, res, next)=>{
    const authHeader =  req.headers.Authorization || req.headers.authorization;

    // Check if Authorization header is present and starts with Bearer
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({message :"Unauthorized : No token provided"})
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE);
        req.user = decoded;
        next();
        
    } catch (error) {
        res.status(401).json({message : "Invalid Token"})
    }
};

module.exports = protect;