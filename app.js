const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const mysql = require('mysql');

const mysqlCredentials = require('./credentials.js');
const app = express();


const db = mysql.createConnection( mysqlCredentials );

app.use( express.static(path.join(__dirname, 'html' ) ) );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/users', (req,res,next)=>{
    let query = 'SELECT * FROM students';
    let sql = mysql.format(query)
        db.query(sql, (err, results, fields)=>{
            if (err) return next(err)
            res.json( results );
        });
    });
app.post('/delete', (req,res,next)=>{
    console.log("request: ", req.body)
    const { student_id } = req.body;
    let query = 'DELETE FROM students WHERE id = ?';
    let inserts = [student_id];
    let sql = mysql.format(query, inserts)
        db.query(sql, (err, results, fields) => {
            if (err) return next(err)
            res.json(results);
        });
    });


app.listen(3000, function(){
    console.log('listening on port 3000')
})
