const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser')
const settingsBill = require('./settings-bill')
const app = express();
const settingsBill2 = settingsBill();
const moment = require('moment');
moment().format();


app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



app.engine('handlebars', exphbs({defaultLayout: 'main',layoutsDir:__dirname+'/views/layouts'}));
app.set('view engine', 'handlebars');


app.get('/', function(req, res){
    let levels = "";
    if(settingsBill2.hasReachedWarningLevel()){
        levels = "warning"
    }
    if(settingsBill2.hasReachedCriticalLevel()){
        levels = "danger"
    }
    res.render('index',{
        settings:settingsBill2.getSettings(),
        totals: settingsBill2.totals(),
        levels: levels
    })

});

app.post('/settings', function(req, res){
    console.log(req.body);
    // res.redirect('/');

    settingsBill2.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel,
    })
    console.log(settingsBill2.getSettings());

    res.redirect('/');
})
app.post('/action', function(req, res){
    console.log(req.body.actionType);

    settingsBill2.recordAction(req.body.actionType)
    res.redirect('/')
    
})
app.get('/actions', function(req, res){
   const totalsMade  = settingsBill2.actions()
   totalsMade.forEach((element)=>{
       element.currentTime = moment(element.timestamp).fromNow()
   });
    res.render('actions',{actions:totalsMade})
    
});

// app.get('/actions/:actionType', function(req, res){
//     const actionType = req.params.actionType;
//     res.render('actions', {actions:settingsBill2.actionsFor(actionType)});
    
// })
app.get('/actions/:actionType', function(req, res){
    const type= req.params.actionType
    const actions =settingsBill2.actions()
    actions.forEach((elem )=> {
        elem.timescamp = moment(elem.timestamps).fromNow()
    })
        
   
    res.render('actions', {action:actions});


})



const  PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
});