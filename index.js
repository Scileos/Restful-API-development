'use strict'

const restify = require('restify')
const server = restify.createServer()
const FS_API = require ('./Public/FatSecret API - Nutrition.js')

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
