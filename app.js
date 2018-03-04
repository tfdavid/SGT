const express = require('express');
const path = require('path');
const mysql = require('mysql');

const mysqlCredentials = require('./credentials.js');
const ws = express();

const db = mysql.createConnection( mysqlCredentials );

ws.use( express.static(path.join(__dirname, 'html' ) ) );

ws.get('/users', (req,res,next)=>{
    let query = 'SELECT * FROM students';
    let sql = mysql.format(query)
        db.query(sql, (err, results, fields)=>{
            if (err) return next(err)
            const output={
                success: true,
                data: results
            }
            res.json( output );
        });
    });

ws.listen(3000, function(){
    console.log('listening on port 3000')
})
