'use strict'

const SP_Key = 'hSYPFdrWE8mshIwh8iTx7DXbAbjap1dU9pijsnGTR808aCq70h'
const rest = require ('restler')
const SP_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com'

//Get recipe by ingredient
const reqObject = {
	fillIngredients: 'false',
	ingredients: '',
	limitLicense: 'false',
	number: '15',
	ranking: '1'
}

exports.GetRecipes = (ingredient) => {
	reqObject.ingredients = ingredient
	rest.get(SP_URL, {
		data: reqObject
	}) .on('complete', function(data) {
		console.log(data)
	})
}

//Get Analyze a recipe search for ingredients