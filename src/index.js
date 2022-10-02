import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from "express";
import mysql from "mysql2";


const app = express()
app.use(express.json());
const port = 3000
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_SCHEMA
})

connection.connect()

app.use(function (req, res, next) {

	console.log('Time:', Date.now());
	if(req.body.token!==process.env.X_API_TOKEN) {
		res.status(401).send("Unauthorized");
		return;
	}
	next();
});


app.get('/', (req, res) => {
	res.send(`${process.env.AAA}`);
});

app.put('/wa/subscriber', (req, res)=>{
	console.log(req.body)
	var parsed = req.body;
	connection.query("INSERT INTO ignis.WA_SUBSCRIBERS (whatsapp_id, area) VALUES (?,?)", [parsed.whatsapp_id, parsed.area]);
	res.status(200).send("Added!");
});

app.delete('/wa/subscriber', (req, res)=>{
	console.log(req.body)
	var parsed = req.body;
	connection.query("DELETE FROM ignis.WA_SUBSCRIBERS WHERE whatsapp_id=?", [parsed.whatsapp_id]);
	res.status(200).send("Deleted!");
});

app.get('/wa/subscriber', async (req, res)=>{
	console.log(req.body);
	const [rows, fields] = await connection.promise().query("SELECT * FROM ignis.WA_SUBSCRIBERS WHERE whatsapp_id=?", [req.body.whatsapp_id]);
	res.send(rows);
});


app.listen(port, () => {
 	console.log(`Example app listening on port ${port}`);
});


setInterval(()=>{
}, 10*60*1000)

process.on('SIGTERM', () => {
	console.info('SIGTERM signal received.');
	connection.end();
});

