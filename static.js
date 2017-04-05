var request = require('request');
var pg = require('pg');
var dbUrl = 'postgres://ghayeuqwyzrpmo:00b2c093f9a39de5414d3a961fe98ba506e009b5fa342dfd3e6a39db58d6e758@ec2-54-75-231-195.eu-west-1.compute.amazonaws.com:5432/d8apki7pn59v74';

var API_KEY = 'RGAPI-75D59888-2CBE-4ADD-82AA-8774239BAA60';

pg.defaults.ssl = true;
pg.connect(dbUrl, function(err, client) {
    if (err) throw err;


    client.query("select version from version", function (requst, result) {

        console.log("Started task");

        request('https://global.api.riotgames.com/api/lol/static-data/EUW/v1.2/versions?api_key=' + API_KEY, function (error, response, body) {
            var jsonResponse = JSON.parse(body);
            var versions = new Object();
            versions.version = jsonResponse[0];


            if (result.rowCount > 0 && versions.version == result.rows[0].version) {
            }
            else {
                console.log(versions.version);
                updateChampionInfo();
                updateItemInfo();
                updateMasteryInfo();
                updateRuneInfo();
                updateSummonerSpellInfo();
                client.query('delete from version');
                client
                    .query('INSERT INTO version (version) VALUES (\'' + versions.version + '\') ON CONFLICT (version) DO UPDATE SET version = \'' + versions.version + '\';');

            }

            if (error)console.log(error);
        });

        //create table champions (id primary key,name text,key text,title text,armor real,armorperlevel real,attackdamage real,attackdamageperlevel real,attackrange real,attackspeedoffset real,attackspeedperlevel real,crit real,critperlevel real,hp real,hpperlevel real,hpregen real,hpregenperlevel real,movespeed real,mp real,mpperlevel real,mpregen real,mpregenperlevel real,spellblock real,spellblockperlevel real,tags text);

        console.info('cron job completed');

        function updateChampionInfo() {

            client.query("delete from champions;")

            request('https://global.api.riotgames.com/api/lol/static-data/EUW/v1.2/champion?champData=stats,image,tags&api_key=' + API_KEY, function (error, response, body) {
                var jsonResponse = JSON.parse(body).data;
                for (var k in jsonResponse) {
                    //TODO replace this
                    var stats = jsonResponse[k].stats;
                    var image = jsonResponse[k].image;

                    var name = jsonResponse[k].name;
                    var title = jsonResponse[k].title;
                    if (name.includes("\'")) {
                        name = name.replace("\'", "\'\'");
                    }
                    if (title.includes("\'")) {
                        title = title.replace("\'", "\'\'");
                    }
                    var tags = jsonResponse[k].tags;
                    var tagsString = "";
                    for (var j in tags)
                        tagsString = tagsString + " " + tags[j] + ",";
                    tagsString = tagsString.substring(0, tagsString.length - 1);
                    client
                        .query("INSERT INTO champions (" +
                            "id, " +
                            "name, " +
                            "key, " +
                            "title, " +
                            "armor, " +
                            "armorperlevel, " +
                            "attackdamage, " +
                            "attackdamageperlevel, " +
                            "attackrange, " +
                            "attackspeedoffset, " +
                            "attackspeedperlevel, " +
                            "crit, " +
                            "critperlevel, " +
                            "hp, " +
                            "hpperlevel, " +
                            "hpregen, " +
                            "hpregenperlevel," +
                            "movespeed, " +
                            "mp, " +
                            "mpperlevel, " +
                            "mpregen, " +
                            "mpregenperlevel, " +
                            "spellblock, " +
                            "spellblockperlevel, " +
                            "imagegroup, " +
                            "imageurl, " +
                            "tags) VALUES (" + parseInt(jsonResponse[k].id) + ",\'" +
                            name + "\',\'" + jsonResponse[k].key + "\', \'" + title + "\', " + parseFloat(stats.armor) + ", " + parseFloat(stats.armorperlevel) + ", " + +parseFloat(stats.attackdamage) + ", " + parseFloat(stats.attackdamageperlevel) + ", " + parseFloat(stats.attackrange) + ", " + parseFloat(stats.attackspeedoffset)
                            + ", " + parseFloat(stats.attackspeedperlevel) + ", " + parseFloat(stats.crit) + ", " + parseFloat(stats.critperlevel) + ", " + parseFloat(stats.hp) + ", " +
                            parseFloat(stats.hpperlevel) + ", " + parseFloat(stats.hpregen) + ", " + parseFloat(stats.hpregenperlevel) + ", " + parseFloat(stats.movespeed) + ", " +
                            parseFloat(stats.mp) + ", " + parseFloat(stats.mpperlevel) + ", " + parseFloat(stats.mpregen) + ", " + parseFloat(stats.mpregenperlevel) + ", " +
                            parseFloat(stats.spellblock) + ", " + parseFloat(stats.spellblockperlevel) + ", \'" + image.group + "\', \'" + image.full + "\', \'" + tagsString + "\') ON CONFLICT (id) DO UPDATE SET name=\'" + name + "\';");

                }
            })
        }

        function updateItemInfo() {

        }

        function updateMasteryInfo() {

        }

        function updateRuneInfo() {

        }

        function updateSummonerSpellInfo() {

        }
    });

    console.log("Ended task");
});