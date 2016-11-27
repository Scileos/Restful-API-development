'use strict'

/** const index = require('./index.js')
const FS_API = require('./Public/FatSeret API - Nutrition.js')

index.server.get('/ingredient/:ingredientID', function(req, res) {
	console.log('Getting values based on ingredient ID')
	const ingredientID = req.params.ingredientID
	const data = FS_API.GetRequest(ingredientID)
	res.setHeader('content-type', 'application/json')
	res.setHeader('Allow', 'GET, POST', 'PUT', 'DELETE')
	res.send(data.code, data.data)
	res.end
})

*/
