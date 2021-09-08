const express = require('express')
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());
const { Kayn, REGIONS } = require('kayn');


const kayn = Kayn(process.env.RIOT_LOL_API_KEY)({
    region: REGIONS.BRAZIL,
    apiURLPrefix: 'https://br1.api.riotgames.com/',
    locale: 'pt_BR',
})



app.get('/champions', (req,res) => {
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


app.post('/result', (req,res) => {

    const championList = req.body
    let tags = []
    championList.map(function getTag(champions){
        tags.push(champions.tags[0]);
        champions.tags[1] != null ?  tags.push(champions.tags[1]) : {} ;
    })
    

    const marksman = tags.filter(tagName => tagName === "Marksman").length;
    const fighter = tags.filter(tagName => tagName === "Fighter").length;
    const tank = tags.filter(tagName => tagName === "Tank").length;
    const mage = tags.filter(tagName => tagName === "Mage").length;
    const assassin = tags.filter(tagName => tagName === "Assassin").length;
    const support = tags.filter(tagName => tagName === "Support").length;

    const tagCount = [marksman,fighter,tank,mage,assassin,support]
    
    res.send(tagCount)
});

app.listen(process.env.PORT || 80);

