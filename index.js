var request = require('request');
var express = require('express');
var app = express();
var pg = require('pg');
var dbUrl = 'postgres://ghayeuqwyzrpmo:00b2c093f9a39de5414d3a961fe98ba506e009b5fa342dfd3e6a39db58d6e758@ec2-54-75-231-195.eu-west-1.compute.amazonaws.com:5432/d8apki7pn59v74';

pg.defaults.ssl = true;
pg.connect(dbUrl, function(err, client) {
  if (err) throw err;

  client
    .query('SELECT id FROM summoners;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });


app.get("/summoner/by-name/:name", function(req, res)
{
	client
	.query('SELECT * FROM summoners where summonername=\'' + req.params.name.toLowerCase().replace(/\s/g,'') + '\'', function(error, result)
	{
		console.log(JSON.stringify(result.rows[0]));
		if(result.rowCount == 0)
		{
			request('https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/'+req.params.name +'?api_key=RGAPI-75D59888-2CBE-4ADD-82AA-8774239BAA60', function (error, response, body) {
				//res.send(body);
				var data = JSON.parse(body);
				var summoner = data[Object.keys(data)[0]];
				
				if(response.statusCode == 200)
				{

					var jsonResponse = new Object();
					
					jsonResponse.id = summoner.id;
					jsonResponse.name = summoner.name;
					jsonResponse.summonername = Object.keys(data)[0];

					res.send(JSON.stringify(jsonResponse));
		
  					client
    				.query('INSERT INTO summoners (name, id, summonername) VALUES (\'' + summoner.name + '\',\'' + parseInt(summoner.id) + '\',\''+ Object.keys(data)[0] + '\') ON CONFLICT (id) DO NOTHING;');
		
					console.log('Added ' + Object.keys(data)[0] + ' to database');
				}
			});
		}
		else
		{
			res.send(JSON.stringify(result.rows[0]));
		}
	});




});

app.get("/summoner/current-game/:id", function (req, res)
{
	request('https://euw.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/EUW1/'+req.params.id +'?api_key=RGAPI-75D59888-2CBE-4ADD-82AA-8774239BAA60', function(error, response, body)
	{
		res.send(body);
	});
});
});

var server = app.listen(process.env.PORT || 5000, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

})









// http.createServer(function(req, resp)
// {
// 	resp.writeHead(200, {'Content-Type': 'text/plain'});
//    var result;
//    request('https://euw.api.pvp.net/api/lol/euw/v1.3/stats/by-summoner/19833633/ranked?season=SEASON2016&api_key=RGAPI-75D59888-2CBE-4ADD-82AA-8774239BAA60', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//     	result = body;
//     	resp.end(body);
//         //console.log(body); // Show the HTML for the Modulus homepage.
//     }
//     else
//     {
//     	result = response.statusCode;
//     	console.log(response.statusCode);
//     	console.log(error);
//     }
// });
   
// }
// 	).listen(8081);
// console.log('Server running at http://127.0.0.1:8081/');