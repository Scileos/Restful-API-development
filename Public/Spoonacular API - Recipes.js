'use strict'

const rest = require ('restler')//Used to make CRUD requests
const SP_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'//API URL


/**
	* This is a private function that can only be used inside the module.
			It creates a suitable URL to call the Spoonacular external API
	*@private
	*@param {string} ingredient - Takes an input of 1 or more ingredients
	*@returns {string} URL to send as a request
 */
const Recipe_URL = module.exports.Recipe_URL = (ingredient) => {

//Get recipe by ingredient
	const reqObject = {
		fillIngredients: 'false',
		ingredients: '',
		limitLicense: 'false',
		number: '15',
		ranking: '1'
	}

	reqObject.ingredients = ingredient

	let paramsStr = ''

	for (const i in reqObject){
		paramsStr += '&' + i + '=' + reqObject[i]
	}

	paramsStr = paramsStr.substr(1)

	const BaseString = SP_URL + 'findByIngredients?' + paramsStr

	return BaseString
}

/** Exports function that sends a GET request and recieves a list of recipes based on the input ingredients */

exports.GetRecipes = (ingredients) => {
	const apiCall = Recipe_URL(ingredients)
	return new Promise((resolve) => {
		rest.get(apiCall, {
			headers: {
				'X-Mashape-Key': 'hSYPFdrWE8mshIwh8iTx7DXbAbjap1dU9pijsnGTR808aCq70h',
				'Accept': 'application/json'
			}
		}) .on('complete', function(data) {
			resolve(data)
		})
	})
}

/** Exports function that sends a GET request and recieves detailed information about a recipe based on the input ID */

exports.searchById = (recipeID) => {
	const apiCall = SP_URL + recipeID + '/information?includeNutrition=true'
	return new Promise((resolve) => {
		rest.get(apiCall, {
			headers: {
				'X-Mashape-Key': 'hSYPFdrWE8mshIwh8iTx7DXbAbjap1dU9pijsnGTR808aCq70h',
				'Accept': 'application/json'
			}
		}).on('complete', function(data) {
			resolve(data)
		})
	})
}
