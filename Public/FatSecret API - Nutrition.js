'use strict'

const FS_Key = 'f861d29a6761473db4ebdb2d2f7bff4e' //API private key
const API_Shared_Secret = '6763ddbf8da14151af37025e94391ac2&' //Shared secret key
const FS_URL = 'http://platform.fatsecret.com/rest/server.api' //API URL
const crypto = require('crypto') //SHA1 algorithm converter
const rest = require('restler')  //Used to make CRUD requests


/**
	* This is a private function within the module that creates a suitable URL to call the FatSecret external API
 @private
	@param {string}  search - The search criteria - Ingredient
	@returns {Object} returns an object of parmaters to use in the URL
	*/
const API_URL = module.exports.API_URL = (search) => {

	const date = new Date

	/** Order of objects matters! Will return error code 8 if not in this order
	*  because the back end oauth_signature will not match yours

	Create object that stores header information
	*/

	const reqObject = {
		format: 'json',
		max_results: 1,
		method: 'foods.search',
		oauth_consumer_key: FS_Key,
		oauth_nonce: Math.random().toString(36).replace(/[a-z]/, '').substr(2),
		oauth_signature_method: 'HMAC-SHA1',
		oauth_timestamp: Math.floor(date.getTime()/1000),
		oauth_version: '1.0',
		search_expression: '',
	}

/** Assign search_expression to be supplied search criteria */
	reqObject.search_expression = search


/** Pump object contents into a variable for URI */

	let paramsStr = ''

	for (const i in reqObject){
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

/** exports function that will get nutritional information for 1 Ingredient
	* and returns it as a promise
 */

exports.GetNutrition = (search) => {
	const data = API_URL(search)
	return new Promise((resolve) => {
		rest.get(FS_URL, {
			data: data
		}) .on('complete', function(data) {
			resolve(data)
		})
	})
}
