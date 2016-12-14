'use strict'

const restify = require('restify') //Used to create the server
const server = restify.createServer()
const FS_API = require ('./Public/FatSecret API - Nutrition.js') //Nutrition API
const SP_API = require ('./Public/Spoonacular API - Recipes.js')//Recipe API
const register = require('./Public/register.js')
const auth = require('./Public/auth.js')
const favourites = require('./Public/Favourites.js')

const defaultPort = 8080


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

/** Used for parsing request bodies */
server.use(restify.bodyParser())


/** On get request to base url return with the home page */
server.get('/',
	restify.serveStatic({
		directory: './views',
	 file: 'input.html'
	})
)

/** Return with the register page */
server.get('/register',
				restify.serveStatic({
					directory: './views',
					file: 'Register.html'
				})
	)

/** POST request that registers a username and password salt */
server.post('/register/salt', function(req, res) {
	register.checkIfExists(req.body).then(() => {
		register.salt(req.body).then((response) => {
			res.json(response)
		})
	})
})

/** POST request that fills in the blanks in the users table /password/ */
server.post('/register/user', function(req, res) {
	const data = JSON.parse(req.body)
	register.final(data.user, data.hashedPass).then((response) => {
		res.json(response)
	}).catch((err) => {
		console.log(err)
	})
})

server.post('/auth', function(req, res) {
	const data = JSON.parse(req.body)
	auth.checkUser(data.user).then((result) => {
		auth.checkPass(data.user, data.pass, result[0].salt).then(() => {
			res.send('Authenticated')
		})
	})
})

server.post('/favourite', function(req, res) {
	const data = JSON.parse(req.body)
	favourites.getUserID(data.user).then((userID) => {
		favourites.checkRecipes(userID, data.recipeID).then(() => {
			favourites.addToFavouritesRec(userID, data.recipeID, data.nutrition).then(() => {
				favourites.checkIngredients(data.recipeID).then(() => {
					favourites.addToFavouritesIng(data.recipeID, data.nutrition).then((result) => {
						res.send(result)
					})
				})
			})
		})
	})
})

server.get('/view/favourites/:username', function(req, res) {
	const user = req.params.username
	favourites.getUserID(user).then((userID) => {
		favourites.viewFavourites(userID).then((result) => {
			res.setHeader('content-type', 'application/json')
			res.setHeader('Allow', 'GET')
			res.send(result)
		})
	})
})

server.del('/delFav', function(req, res) {
	const data = JSON.parse(req.body)
	const toDelete = data.recipeID
	const username = data.user
	favourites.getUserID(username).then((userID) => {
		favourites.deleteFavRec(userID, toDelete).then(() => {
			res.send('Deleted item')
		})
	})
})

server.put('/updatePass/:username', function(req, res) {
	const username = req.params.username
	const data = JSON.parse(req.body)
	favourites.getUserID(username).then((userID) => {
		auth.updatePassword(userID, data.newPass)
		res.send('Password Updated')
	})
})

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

server.get('/recipeIng/:ingredients', function(req, res) {
	res.setHeader('content-type', 'application/json')
	res.setHeader('Allow', 'GET')
	const ingredients = req.params.ingredients
	SP_API.GetRecipes(ingredients).then((result) => {
		SP_API.fillRecipeObj(result).then((recipeObj) => {
			SP_API.fillIngredients(recipeObj).then(() => {
				res.send(recipeObj)
				res.end
			})
		})
	})
})


module.exports = server
