const pool = require('../model/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {v4 : uuidv4} = require('uuid');

exports.register = async(req, res)=>{
    
        const {username, password} = req.body;
    try {
        const userCheck = await pool.query(
            `SELECT * FROM users WHERE username = $1`,
        [username]
        );

        if(userCheck.rows.length > 0){
            return res.status(400).json({message: 'Username already exists'});
        }

        //Password Hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        await pool.query(
            `INSERT INTO users (id, username, password)
            VALUES($1, $2, $3)`,
            [userId, username, hashedPassword]
        );
        res.status(200).json({message : "User Created Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
        
    }

};


//Login
exports.login = async(req,res)=>{
    const {username, password} = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        );
        if(result.rows.length === 0){
            return res.status(400).json({message : "Invalid credentials"})
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {userId : user.id},
            process.env.ACCESS_TOKEN_SECRETE,
            {expiresIn:'1h'}
        );
        res.status(200).json({message : "Login Successful", token});

        
    } catch (error) {
        res.status(500).json(error.message);
    }
};