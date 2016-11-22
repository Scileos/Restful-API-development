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

function validateJson(json) {
	if (json === undefined) {
		//console.log('UNDEFINED')
		return false
	}
	if (typeof json.name !== 'string') {
		//console.log(`NAME NOT STRING`)
		return false
	}
	/* returns false if the list key is not an Array */
	if (!Array.isArray(json.list)) {
		//console.log('LIST NOT ARRAY')
		return false
	}
	/*  */
	//for(let i=0; i<json.list.length; i++) {
	//	if (typeof json.list[i] !== 'string') {
	//		console.log('ARRAY INDEX NOT STRING')
	//		return false
	//	}
	//}
	for (const item of json.list) if ( typeof item !== 'string') return false
	/* otherwise return true */
	return true
}

/** test GET request 
	server.get ('/Ingredient/Nutrition', function(req, res) {
	const Ingredient_ID = req.params.ID

	console.log('Getting nutrtion based on ingredient')
	const data = Nutrition.getByID(Ingredient_ID)
}
 ) */