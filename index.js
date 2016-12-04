'use strict'

const restify = require('restify')
const server = restify.createServer()
const FS_API = require ('./Public/FatSecret API - Nutrition.js')
const SP_API = require ('./Public/Spoonacular API - Recipes.js')
const readline = require('readline-sync')
const async = require('async')

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

server.get('/nutrition/:search', function(req, res) {
	const search = req.params.search
	FS_API.GetNutrition(search).then((result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET')
		res.send(result)
		res.end
	})
})

server.get('recipeIng/:ingredients', function(req, res) {
	res.setHeader('content-type', 'application/json')
	res.setHeader('Allow', 'GET')
	const ingredients = req.params.ingredients

	new Promise((resolve) => {
		const recipeObj = {
			recipeName: [] ,
			recipeID: [],
			recipeIngredients: []
		}

		SP_API.GetRecipes(ingredients).then((result) => {
			for (const i in result) {
				recipeObj.recipeName[i] = result[i].title
				recipeObj.recipeID[i] = result[i].id
			}
			for (const i in recipeObj.recipeName){
				recipeObj.recipeIngredients[i] = []
			}
			resolve(recipeObj)
		})
	})

	.then((recipeObj) => {
		async.each(recipeObj.recipeID, function(recipeID, callback) {
			SP_API.searchById(recipeID).then((ID) => {
				for (const n in ID.extendedIngredients) {
					recipeObj.recipeIngredients[recipeObj.recipeID.indexOf(recipeID)][n] = {Ingredient: '', Amount: '', Unit: '' }
					recipeObj.recipeIngredients[recipeObj.recipeID.indexOf(recipeID)][n].Ingredient = ID.extendedIngredients[n].name
					recipeObj.recipeIngredients[recipeObj.recipeID.indexOf(recipeID)][n].Amount = ID.extendedIngredients[n].amount
					recipeObj.recipeIngredients[recipeObj.recipeID.indexOf(recipeID)][n].Unit = ID.extendedIngredients[n].unitLong
				}
				callback()
			})
		},function() {
			res.send(recipeObj)
			res.end
		})
	})
})


server.get('recipe/:recipeID', function(req, res) {
	const recipeID = req.params.recipeID
	SP_API.searchById(recipeID).then((result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET')
		res.send(result)
		res.end
	})
})
