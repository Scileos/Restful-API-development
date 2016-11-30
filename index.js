'use strict'

const restify = require('restify')
const server = restify.createServer()
const FS_API = require ('./Public/FatSecret API - Nutrition.js')
const SP_API = require ('./Public/Spoonacular API - Recipes.js')
const readline = require('readline-sync')

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

server.get('/',
	restify.serveStatic({
		directory: './views',
	 default: 'input.html'
	})
)

server.get('/ingredient/:ingredientID', function(req, res) {
	const ingredientID = req.params.ingredientID
	FS_API.GetIngredientID(ingredientID).then((result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET')
		res.send(result)
		res.end
	})
})

server.get('recipeIng/:ingredients', function(req, res) {
	const ingredients = req.params.ingredients
	SP_API.GetRecipes(ingredients).then((result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET')
		res.send(result)
		res.end
	})
})

server.get('recipe/:recipeID/', function(req, res) {
	const recipeID = req.params.recipeID
	SP_API.searchById(recipeID).then((result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET')
		res.send(result)
		res.end
	})
})
