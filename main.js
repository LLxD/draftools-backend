const express = require('express')
const cors = require('cors')
const app = express();
app.use(cors());
const { Kayn, REGIONS } = require('kayn');
const { response } = require('express');


const kayn = Kayn(process.env.RIOT_LOL_API_KEY)({
    region: REGIONS.BRAZIL,
    apiURLPrefix: 'https://br1.api.riotgames.com/',
    locale: 'pt_BR',
})



app.get('/champions', (res) => {
    kayn.DDragon.Champion.list().then(function (champions) {
        console.log(champions.data)
        const champfilter = champions.data;
        let table = [];
        for (champion in champfilter) {
            championinfo = champfilter[champion];
            table.push({
                name: championinfo.name,
                tags: championinfo.tags,
                key: championinfo.key,
                square_image: 'http://ddragon.leagueoflegends.com/cdn/' + championinfo.version + '/img/champion/' + championinfo.image.full,
                loading_image: 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/' + championinfo.id + '_0.jpg'
            })
        }

        res.send(table)
    });
});
app.get('/result', (res) => {

    const champions = res
    // let tags = table.map(function getTag(champions){
    //     return champions.tags;
    // })
    res.send(champions)
});

app.listen(process.env.PORT || 80);

