var request = require('request');
var pg = require('pg');
var dbUrl = '';

var API_KEY = '';
var CHAMPIONGG_API_KEY = "";

pg.defaults.ssl = true;
pg.connect(dbUrl, function(err, client) {
    if (err) throw err;
            function updateChampionGGInfo()
            {
                request('http://api.champion.gg/stats?api_key=' + CHAMPIONGG_API_KEY, function (error, response, body) {
                    var jsonResponse = JSON.parse(body);

                    client.query("DELETE from championgg;");

                    for(var i=0; i<jsonResponse.length; i++)
                    {
                        var key = jsonResponse[i].key;
                        var role = jsonResponse[i].role;
                        var name = jsonResponse[i].name;
                        if (name.includes("\'")) {
                            name = name.replace("\'", "\'\'");
                        }
                        if (key.includes("\'")) {
                            key = key.replace("\'", "\'\'");
                        }

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
