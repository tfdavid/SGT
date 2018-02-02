const express = require('express');
const path = require('path');
const mysql = require('mysql');

const mysqlCredentials = require('./credentials.js');
const ws = express();

const db = mysql.createConnection( mysqlCredentials );

ws.use( express.static(path.join(__dirname, 'html' ) ) );

ws.get('/users', function(req,res){
    db.connect(function(){
        db.query('SELECT * FROM students', function(error, rows, fields){
            console.log(rows);
            const output={
                success: true,
                data: rows
            }
            const json_output = JSON.stringify( output );
            res.send( json_output );

        })

    });
  
});

ws.listen(3000, function(){
    console.log('listening on port 3000')
})
