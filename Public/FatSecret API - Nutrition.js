'use strict'


const FS_Key = 'f861d29a6761473db4ebdb2d2f7bff4e'
var API_Shared_Secret = '6763ddbf8da14151af37025e94391ac2'
const FS_URL = 'http://platform.fatsecret.com/rest/server.api'
const crypto = require('crypto')
const rest = require('restler')
const date = new Date

/** Order of objects matters! Will return error code 8 if not in this order
	*  because the back end oauth_signature will not match yours 
	
	Create object that stores header information
	*/

var reqObject = {
	food_id: '33961',
	format: 'json',
	method: 'food.get',
	oauth_consumer_key: FS_Key,
	oauth_nonce: Math.random().toString(36).replace(/[a-z]/, '').substr(2),
	oauth_signature_method: 'HMAC-SHA1',
	oauth_timestamp: Math.floor(date.getTime()/1000),
	oauth_version: '1.0'
}

/** Pump object contents into a variable for URI */

var paramsStr = ''

for (var i in reqObject){
	paramsStr += '&' + i + '=' + reqObject[i]
}

/** start from the second character to remove unnecessary '&' symbol */

paramsStr = paramsStr.substr(1)

/** Join the HTTP request/URL/ and Params into a useable string */

var sigBaseString = 'GET&' + encodeURIComponent(FS_URL) + '&' + encodeURIComponent(paramsStr)

API_Shared_Secret += '&'

/** Create the oauth_signature using HMAC-SHA1 encryption using the Shared Secret key and our % encrypted URI (specification of the API) */

var oauthSig = crypto.createHmac('sha1', API_Shared_Secret).update(sigBaseString).digest('base64')

/** Add this ouath key into the original header object */

reqObject.oauth_signature = oauthSig

/**Simple restful GET request using the headers from our object */

 rest.get(FS_URL, {
	data: reqObject
}) .on('complete', function(data, response) {
	console.log(data)
})



