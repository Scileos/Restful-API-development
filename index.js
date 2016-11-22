'use strict'

const restify = require('restify')
const server = restify.createServer()

const Recipes = require('./Public/Spoonacular API - Recipes.js')
const Nutrition = require('./Public/FatSecret API - Nutrition.js')

const defaultPort = 3000

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