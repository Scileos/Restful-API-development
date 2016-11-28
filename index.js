'use strict'

const restify = require('restify')
const server = restify.createServer()
const FS_API = require ('./Public/FatSecret API - Nutrition.js')
const SP_API = require ('./Public/Spoonacular API - Recipes.js')

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

server.get('/ingredient/:ingredientID', function(req, res) {
	console.log('Getting values based on ingredient ID')
	const ingredientID = req.params.ingredientID
	FS_API.GetIngredientID(ingredientID).then((result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET')
		res.send(result)
		res.end
	})
})

server.get('recipe/:ingredient', function(req, res) {
	const ingredient = req.params.ingredient
	req.setHeader('X-Mashape-Key', SP_API.SP_Key)
	req.setHeader('Accept', 'application/json')
	const result = SP_API.GetRecipes(ingredient)
	res.setHeader('content-type', 'application/json')
	res.setHeader('Allow', 'GET')
	res.send(result)
	res.end

})
