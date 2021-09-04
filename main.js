const express = require('express')
const app = express();

const { Kayn, REGIONS } = require('kayn')


const kayn = Kayn("RGAPI-4c985925-373c-456b-9e80-c6d71c812723")({
    region: REGIONS.BRAZIL,
    apiURLPrefix: 'https://br1.api.riotgames.com/',
    locale: 'pt_BR',
})

app.get('/champions', (req, res) => {
    kayn.DDragon.Champion.list().then(function (champions) {
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
app.get('/result', (req, res) => {
    console.log(req);
});

app.listen(process.env.PORT || 80);

