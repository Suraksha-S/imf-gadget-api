const pool = require('../model/db.js');
const { v4 : uuidv4} = require('uuid');

const codeNames = ["The Nightingale", "The Kraken", "The Falcon", "The Ghost"];

//Add the gadget
exports.addGadget = async (req,res)=>{
    try {
        const { name, status } = req.body;
    const id = uuidv4();
    const codename = codeNames[Math.floor(Math.random() * codeNames.length)];
    const userId = req.user.userId;

    const query = `
      INSERT INTO gadgets (id, name, codename, status, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    
    const result = await pool.query(query, [id, name, codename, status, userId]);
    
    const probability = `${Math.floor(Math.random() * 40) + 60}%`;
       res.status(201).json({
        ...result.rows[0],
        successProbability: probability
});

    } catch (error) {
        res.status(500).json({message : error.message});
        
    }
};

//Get the gadgets
exports.getGadget = async (req, res)=>{
    try {
        const status  = req.query.status;
        let result;
        const userId = req.user.userId;

        if(status){
            result = await pool.query(
                'SELECT * FROM gadgets WHERE status = $1 AND user_id = $2',
                 [status, userId]
                );
            } else {
                 result = await pool.query(
                    'SELECT * FROM gadgets WHERE user_id = $1',
                    [userId]
                );
            }

        const gadgetsWithProbability = result.rows.map(gadget => ({
            ...gadget,
            successProbability: `${Math.floor(Math.random() * 40) + 60}%`
        }));
        
        res.json(gadgetsWithProbability);
    } catch (error) {
        res.status(500).json({message  : error.message});
    }
};

//Update the gadgets

exports.updateGadget = async (req,res)=>{
    try {
        const {id} = req.params;
        const {name, status,codename} = req.body;
        const userId = req.user.userId;
        
       const result = await pool.query(
      `UPDATE gadgets
       SET name = $1, status = $2, codename = $3
       WHERE id = $4
       RETURNING *`,
      [name, status, codename, id]
    );
    
    
    if(result.rows.length === 0){
            return res.status(404).json({message:"Gadget not found"});
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({message : error.message});
        
    }
};

//Decommission gadget 

exports.decommissionGadget = async (req,res)=>{
    try {
        const {id} = req.params;
        const decommissionedAt = new Date();
        const userId = req.user.userId;
        
        
        const check = await pool.query(
            'SELECT * FROM gadgets WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        
        if (check.rows.length === 0) {
            return res.status(403).json({ message: "You can't update this gadget" });
        }


        const result = await pool.query(
            `UPDATE gadgets 
            SET status = 'Decommissioned',
                decommissioned_at = $1
            WHERE id = $2
            RETURNING *`,
            [decommissionedAt, id]
        );

        if(result.rows.length === 0){
            res.status(404).json({message : "Gadget not found"})
        }
        res.status(200).json({
            message: "Gadget successfully decommissioned",
            gadget: result.rows[0]
        })
        
    } catch (error) {
        res.status(500).json({message : error.message});
        
    }
};

//Self destruct
exports.selfDestruct = async (req, res)=>{
    try {
        const {id} = req.params;

        const result = await pool.query(
            `SELECT * FROM gadgets WHERE id = $1`,
            [id]
        );

        if(result.rows.length === 0){
            res.status(404).json({message:"Gadget not Found"});
        }

        const confirmationCode = Math.floor(100000 + Math.random() * 900000);

        res.status(200).json({
            message : "Self-destruct sequence initiated",
            gadget : result.rows[0],
            confirmationCode : confirmationCode
        });
    } catch (error) {
        
    }
}

