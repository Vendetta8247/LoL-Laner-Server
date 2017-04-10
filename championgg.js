var request = require('request');
var pg = require('pg');
var dbUrl = 'postgres://ghayeuqwyzrpmo:00b2c093f9a39de5414d3a961fe98ba506e009b5fa342dfd3e6a39db58d6e758@ec2-54-75-231-195.eu-west-1.compute.amazonaws.com:5432/d8apki7pn59v74';

var API_KEY = 'RGAPI-75D59888-2CBE-4ADD-82AA-8774239BAA60';
var CHAMPIONGG_API_KEY = "9500ef4bb169271b0763c3075be49d85";

pg.defaults.ssl = true;
pg.connect(dbUrl, function(err, client) {
    if (err) throw err;
            function updateChampionGGInfo()
            {
                request('http://api.champion.gg/stats?api_key=' + CHAMPIONGG_API_KEY, function (error, response, body) {
                    var jsonResponse = JSON.parse(body);

                    for(var i=0; i<jsonResponse.length; i++)
                    {
                        var key = jsonResponse[i].key;
                        var role = jsonResponse[i].role;
                        var name = jsonResponse[i].name;

                        var general = jsonResponse[i].general;
                        var overallPositionChange = general.overallPositionChange;
                        var overallPosition = general.overallPosition;
                        var goldEarned = general.goldEarned;
                        var neutralMinionsKilledEnemyJungle = general.neutralMinionsKilledEnemyJungle;
                        var neutralMinionsKilledTeamJungle = general.neutralMinionsKilledTeamJungle;
                        var minionsKilled = general.minionsKilled;
                        var largestKillingSpree = general.largestKillingSpree;
                        var totalHeal = general.totalHeal;
                        var totalDamageTaken = general.totalDamageTaken;
                        var totalDamageDealtToChampions = general.totalDamageDealtToChampions;
                        var assists = general.assists;
                        var deaths = general.deaths;
                        var kills = general.kills;
                        var experience = general.experience;
                        var banRate = general.banRate;
                        var playPercent = general.playPercent;
                        var winPercent = general.winPercent;

                        client
                            .query("INSERT INTO championgg (" +
                                "key, " +
                                "role, " +
                                "name, " +
                                "overallPositionChange, " +
                                "overallPosition, " +
                                "goldEarned, " +
                                "neutralMinionsKilledEnemyJungle, " +
                                "neutralMinionsKilledTeamJungle, " +
                                "minionsKilled, " +
                                "largestKillingSpree, " +
                                "totalHeal, " +
                                "totalDamageTaken, " +
                                "totalDamageDealtToChampions, " +
                                "assists, " +
                                "deaths, " +
                                "kills," +
                                "experience, " +
                                "banRate, " +
                                "playPercent, " +
                                "winPercent " +
                                ") VALUES (\'" +
                                key + "\',\'" + role + "\', \'" + name + "\', " + parseInt(overallPositionChange) + ", " + parseInt(overallPosition) + ", " + +parseInt(goldEarned) + ", " + parseFloat(neutralMinionsKilledEnemyJungle) + ", " + parseFloat(neutralMinionsKilledTeamJungle) + ", " + parseFloat(minionsKilled)
                                + ", " + parseFloat(largestKillingSpree) + ", " + parseInt(totalHeal) + ", " + parseInt(totalDamageTaken) + ", " + parseInt(totalDamageDealtToChampions) + ", " +
                                parseFloat(assists) + ", " + parseFloat(deaths) + ", " + parseFloat(kills) + ", " + parseFloat(experience) + ", " +
                                parseFloat(banRate) + ", " + parseFloat(playPercent) + ", " + parseFloat(winPercent) + ") ON CONFLICT (id) DO UPDATE SET name=\'" + name + "\';");

                    }

                })
            }

    updateChampionGGInfo();
});