// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var util = require('util');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
//mongoose.connect('mongodb://localhost/projetao');
mongoose.connect('mongodb://admin:YSJip3mWHEcr@$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/projetaotestes');
var db =  mongoose.connection;
db.on('error', console.error);


var ftSchema = new mongoose.Schema({
    nome: String,
    local: String
});

var Foodtruck = mongoose.model('Foodtruck',ftSchema);





var router = express.Router();              // get an instance of the express Router

router.use(bodyParser.json());
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/foodtrucks',function(req, res) {
    Foodtruck.find({}, function (err, docs) {
        res.json(docs);
    });
});

router.post('/foodtrucks',function(req,res){
    var ft =  new Foodtruck({
        nome: req.body.nome,
        local: req.body.local
    });
    ft.save(function(err){
       if(err) throw err;
        console.log('Foodtruck registered');
    });
});



// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================

app.listen(port,ipaddr);
console.log('Magic happens on port ' + port);
