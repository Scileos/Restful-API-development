'use strict'

const MG_API = require ('./Merging API - ToCall.js')

const FS_Key = 'f861d29a6761473db4ebdb2d2f7bff4e'
let API_Shared_Secret = '6763ddbf8da14151af37025e94391ac2&'
const FS_URL = 'http://platform.fatsecret.com/rest/server.api'
const crypto = require('crypto')
const rest = require('restler')
const date = new Date


function API_URL(ingredientID) {

	/** Order of objects matters! Will return error code 8 if not in this order
	*  because the back end oauth_signature will not match yours 
	
	Create object that stores header information
	*/

	const reqObject = {
		food_id: '' ,
		format: 'json',
		method: 'food.get',
		oauth_consumer_key: FS_Key,
		oauth_nonce: Math.random().toString(36).replace(/[a-z]/, '').substr(2),
		oauth_signature_method: 'HMAC-SHA1',
		oauth_timestamp: Math.floor(date.getTime()/1000),
		oauth_version: '1.0'
	}

/** Assign food_id to be supplied search criteria */
	reqObject.food_id = ingredientID


/** Pump object contents into a variable for URI */

	let paramsStr = ''

	for (var i in reqObject){
		paramsStr += '&' + i + '=' + reqObject[i]
	}

/** start from the second character to remove unnecessary '&' symbol */

	paramsStr = paramsStr.substr(1)

/** Join the HTTP request/URL/ and Params into a useable string */

	const sigBaseString = 'GET&' + encodeURIComponent(FS_URL) + '&' + encodeURIComponent(paramsStr)


/** Create the oauth_signature using HMAC-SHA1 encryption using the Shared Secret key and our % encrypted URI (specification of the API) */

	const oauthSig = crypto.createHmac('sha1', API_Shared_Secret).update(sigBaseString).digest('base64')

/** Add this ouath key into the original header object */

	reqObject.oauth_signature = oauthSig

	return reqObject
}

exports.GetIngredientID = (ingredientID) => {
	const data = API_URL(ingredientID)
	return new Promise((resolve) => {
		rest.get(FS_URL, {
			data: data
		}) .on('complete', function(data) {
			resolve(data)
		})
	})
}
