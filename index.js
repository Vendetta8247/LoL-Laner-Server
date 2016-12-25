var request = require('request');
var express = require('express');
var app = express();


app.get("/summoner/by-name/:name", function(req, res)
{
	request('https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/'+req.params.name +'?api_key=RGAPI-75D59888-2CBE-4ADD-82AA-8774239BAA60', function (error, response, body) {
		res.send(body);
	});
})

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