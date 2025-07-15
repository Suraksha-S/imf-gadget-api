const express = require('express')
const app = express();
require('dotenv').config()

const authRoutes = require('./auth/authRoutes.js')
const gadgetRoutes = require('./routes/gadgetRoutes.js');
const protect = require('./middleware/authMiddleware.js')


app.use(express.json());




//Public route
app.use('/auth', authRoutes)

//Protected route
app.use('/gadgets', protect, gadgetRoutes);


const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`The server is running on port ${port}`)
})