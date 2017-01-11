var request = require('request');
var express = require('express');
var app = express();
var pg = require('pg');
var dbUrl = 'postgres://ghayeuqwyzrpmo:00b2c093f9a39de5414d3a961fe98ba506e009b5fa342dfd3e6a39db58d6e758@ec2-54-75-231-195.eu-west-1.compute.amazonaws.com:5432/d8apki7pn59v74';
var API_KEY = 'RGAPI-75D59888-2CBE-4ADD-82AA-8774239BAA60';

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
	if(req.query.force == 'true')
	console.log("Force update = " + req.query.force);
	client
	.query('SELECT * FROM summoners where summonername=\'' + req.params.name.toLowerCase().replace(/\s/g,'') + '\'', function(error, result)
	{
		console.log(JSON.stringify(result.rows[0]));
		if(result.rowCount == 0)
		{
			function getSummonerId()
			{
			request('https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/'+req.params.name +'?api_key='+ API_KEY, function (error, response, body) {
				//res.send(body);
				var data = JSON.parse(body);
				var summoner = data[Object.keys(data)[0]];

				if (response.statusCode == 429) 
				{
					console.log("Waiting for 5000 ms in getSummonerId");
					setTimeout(function()
					{
						console.log("5000 ms passed");
						getSummonerId();
					},5000);
				}
				
				else if(response.statusCode == 200)
				{

					var jsonResponse = new Object();
					
					jsonResponse.id = summoner.id;
					jsonResponse.name = summoner.name;
					jsonResponse.summonername = Object.keys(data)[0];

					res.send(JSON.stringify(jsonResponse));
		
  					client
    				.query('INSERT INTO summoners (name, id, summonername) VALUES (\'' + summoner.name + '\',\'' + parseInt(summoner.id) + '\',\''+ Object.keys(data)[0] + '\') ON CONFLICT (id) DO UPDATE SET name=\''+summoner.name+'\', summonername=\''+Object.keys(data)[0]+'\';');
		
					console.log('Added ' + Object.keys(data)[0] + ' to database');
				}

				else res.sendStatus(response.statusCode);
				
				});
			}
			getSummonerId();
		}
		else
		{
			res.send(JSON.stringify(result.rows[0]));
		}


	});




});




app.get("/stats/ranked/:idArray", function(req, res)
{
	var season =  req.query.season || 'SEASON2017';
	var array = req.params.idArray.split(',');
	var responseArray = [];
	console.log(responseArray[0])
	for(i = 0; i<array.length; i++)
	{
		console.log(array[i]);
		getLeagueStats(array[i]);

	}

	function getLeagueStats(id)
	{
		request('https://euw.api.pvp.net/api/lol/euw/v1.3/stats/by-summoner/' + id + '/ranked?season='+ season + '&api_key=' + API_KEY, function(error, response, body)
		{
			if(response.statusCode==429)
			{
				console.log("Waiting for 5000 ms in getLeagueStats");
				setTimeout(function()
				{
					console.log("5000 ms passed");
					getLeagueStats(id);
				},5000);
			}
			else
			{
				var data = JSON.parse(body);
				var toReturn = new Object();
				toReturn.id = id;
				toReturn.champions = data.champions;
				responseArray.push(toReturn);
				//res.write(JSON.stringify(responseArray[responseArray.length-1]) + ',\n\n\n');
				if(responseArray.length==array.length)
				{
					for(var i = 0; i<responseArray.length; i++)
					{
						res.write(JSON.stringify(responseArray[i]) + ',\n\n');
					}
					res.end();
				}

			}
			console.log(error);
		});
	}

});

app.get("/summoner/all", function(req,res)
{
	client.query("SELECT * from summoners;")
	.on('row', function(row, result) {
      result.addRow(row);
    })
    .on('end', function(result) {
      res.send(JSON.stringify(result.rows));
    });

});

app.get("/current-game/:id", function (req, res)
{
	function getCurrentGame()
	{	
	request('https://euw.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/EUW1/'+req.params.id +'?api_key=' + API_KEY, function(error, response, body)
	{
		if(response.statusCode==429)
		{
			console.log("Waiting for 5000 ms in getCurrentGame");
			setTimeout(function()
			{
				console.log("5000 ms passed");
				getCurrentGame();
			},5000);
		}
		else
		{
		res.write(body);
		res.end();
		}
	console.log(error);
	});
	}
	getCurrentGame();
});



app.get('/summoner/league/entry/:idArray',function (req,res) {
	function getLeagueEntry()
	{
		request('https://euw.api.pvp.net/api/lol/euw/v2.5/league/by-summoner/'+ req.params.idArray + '/entry?api_key=' + API_KEY, function(error, response, body)
		{
			if(response.statusCode==429)
			{
				console.log("Waiting for 5000 ms in getLeagueEntry");
				setTimeout(function()
				{
					console.log("5000 ms passed");
					getLeagueEntry();
				},5000);
			}
			else
			{
				res.write(body);
				res.end();
			}
			console.log(error);
		});
	}
	getLeagueEntry();
});


});

var server = app.listen(process.env.PORT || 5000, function () {

  var host = server.address().adress;
  var port = server.address().port;
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