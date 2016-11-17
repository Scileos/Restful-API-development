'use strict'

const restify = require('restify')
const server = restify.createServer()

const Recipes = require('./public/Spoonacular API.js')
const Nutrition = require('./public/Fat Secret API.js')

const defaultPort = 8080

const port = process.env.PORT || defaultPort
server.listen(port, function(err) {
	if (err) {
		console.error(err)
	} else {
		console.log('Listening on port : ' + port)
	}
}
)

/** test GET request 
	server.get ('/Ingredient/Nutrition', function(req, res) {
	const Ingredient_ID = req.params.ID

	console.log('Getting nutrtion based on ingredient')
	const data = Nutrition.getByID(Ingredient_ID)
}
 ) */