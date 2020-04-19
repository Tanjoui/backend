const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = 4000;
const DATABASE_LOCATION = 'mongodb://127.0.0.1:27017/user';

const app = express();
const routes = express.Router();

let User = require('./models/user.model');


app.use(cors());
app.use(bodyParser.json());

mongoose.connect(DATABASE_LOCATION, {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;

connection.once('open', function() {
	console.log("Mongodb database connextion succes");
})




routes.route('/').get(function(req, res) { //functionto handle incomoing HHTT
	//GET on //URL puis on apelle .find pour recup les item
	//arg1: callback executé quand resulatas dispo
	//res.json pour etre sur qu'on recoit bien du json
	User.find(function(err, user) {
		if (err){
			console.log(err);
		} else {
			res.json(user);
		}
	});
});

//cette route retrouve un item selon son id,
//on accepte le parametre d'url id,
//quand l'objet est dispo, on on envoie une reponse HTTP au format JSON
routes.route('/:id').get(function(req, res) {
	let id = req.params.id;
	User.findById(id, function(err, user) {
		res.json(user);
	})
})

//requete post pour creer
routes.route('/add').post(function(req, res) {
	let user = new User(req.body);
	user.save().
		then(user => {
			res.status(200).json({'user': 'added avec succes'});
		})
		.catch(err => {
			res.status(400).send('add failed');
		});
});


routes.route('/update/:id').post(function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if(!user){
			res.status(404).send("not found");
		} else {
			user.userid = req.body.userid;
		  user.email= req.body.email;
		  user.password= req.body.password;
		  user.usertype= req.body.usertype;
		  user.mobilephone= req.body.mobilephone;
		  user.isconnected= req.body.isconnected;

			user.save().then(user => {
				res.json('User updated');
			})
			.catch(err => {
				res.status(400).send("Update impossible");
			});
		}
	});
});

app.use('/user', routes);
app.listen(PORT, function() {
	console.log("serv run on port: " + PORT);
});
