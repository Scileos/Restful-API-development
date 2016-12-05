'use strict'

const restify = require('restify') //Used to create the server
const server = restify.createServer()
const FS_API = require ('./Public/FatSecret API - Nutrition.js') //Nutrition API
const SP_API = require ('./Public/Spoonacular API - Recipes.js')//Recipe API
const async = require('async')//Used to loop through requests one by one

const defaultPort = 3000

/** Create server listening on port 3000 */

const port = process.env.PORT || defaultPort
server.listen(port, function(err) {
	if (err) {
		console.error(err)
	} else {
		console.log('Listening on port : ' + port)
	}
}
)

/** To be implemented WebAPP front end */
//server.get('/',
	//restify.serveStatic({
		//directory: './views',
	 //default: 'input.html'
	//})
//)

/** Get nutrition based on search criteria, can only take one input */

server.get('/nutrition/:search', function(req, res) {
	const search = req.params.search
	FS_API.GetNutrition(search).then((result) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET')
		res.send(result)
		res.end
	})
})

/**Get recipes based on input ingredients as well as listing all their ingredients */

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

