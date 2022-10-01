import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from "express";
import mysql from "mysql";

const app = express()
const port = 3000
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_SCHEMA
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

connection.end()



app.get('/', (req, res) => {
	res.send(`${process.env.AAA}`)
})

app.listen(port, () => {
 	console.log(`Example app listening on port ${port}`)
})


setInterval(()=>{
	// TODO FIRMS request goes here
})