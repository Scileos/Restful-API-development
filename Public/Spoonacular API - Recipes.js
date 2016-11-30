'use strict'

const SP_Key = 'hSYPFdrWE8mshIwh8iTx7DXbAbjap1dU9pijsnGTR808aCq70h'
const rest = require ('restler')
const SP_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'

function Recipe_URL(ingredient) {

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


//Get Analyze a recipe search for ingredients