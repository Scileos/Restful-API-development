'use strict'

const restify = require('restify')
const server = restify.createServer()

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
