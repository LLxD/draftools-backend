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
                info: championinfo.info,
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
    let attributes_attack = []
    let attributes_defense = []
    let attributes_magic = []
    const attackThreshold = 20
    const defenseThreshold = 20
    const magicThreshold = 20

    championList.map(function getTag(champions){
        tags.push(champions.tags[0]);
        champions.tags[1] != null ?  tags.push(champions.tags[1]) : {} ;
    })
    championList.map(function getAttributes(champions){
        attributes_attack.push(champions.info.attack);
        attributes_defense.push(champions.info.defense);
        attributes_magic.push(champions.info.magic);
    })
    

    const marksman = tags.filter(tagName => tagName === "Marksman").length;
    const fighter = tags.filter(tagName => tagName === "Fighter").length;
    const tank = tags.filter(tagName => tagName === "Tank").length;
    const mage = tags.filter(tagName => tagName === "Mage").length;
    const assassin = tags.filter(tagName => tagName === "Assassin").length;
    const support = tags.filter(tagName => tagName === "Support").length;

    const tagCount = [marksman,fighter,tank,mage,assassin,support]
    
    const attackSum = attributes_attack.reduce((a, b) => a + b, 0)
    const defenseSum = attributes_defense.reduce((a, b) => a + b, 0)
    const magicSum = attributes_magic.reduce((a, b) => a + b, 0)
    

    const attributesSum = [attackSum,defenseSum,magicSum]

    let results = [];
    if(attackSum <= attackThreshold){
        results.push("Vish, sua composição está com pouco dano físico :(... Que tal um hypercarry?")
    }
    else if (defenseSum <= defenseThreshold){
        results.push("Vish, sua composição está com pouca defesa :(, seria intessante colocar champions com mais vida!")
    }
    else if (magicSum <= magicThreshold){
        results.push("Vish, sua composição está com pouco dano mágico :(, seria intessante colocar champions mais AP!")
    }
    else{
        results.push("Rapai, a comp ficou quente hein?")
    }


    

    res.send(results)
});

app.listen(process.env.PORT || 80);

