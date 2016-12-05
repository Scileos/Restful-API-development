'use strict'

const readline = require('readline-sync')
const rest = require('restler')
const async = require ('async')


/**
	* A private function used within this module to convert the given unit of measurement into grams in order to be used by FatSecret
	@private
	@param {string} unit - The given unit of measurement eg: teaspoon
	@param {int} amount - The amount of said unit eg: 2 "teaspoons"
	@returns {int} The converted value
 */
function changeToGrams(unit, amount) {
	let newValue = ''
	switch(unit) {
		case 'teaspoons':
			newValue = amount * 4
			return newValue
		case 'teaspoon':
			newValue = amount * 4
			return newValue
		case 'tbsps':
			newValue = amount * 15
			return newValue
		case 'tbsp':
			newValue = amount * 15
			return newValue
		case 'tablespoon':
			newValue = amount * 15
			return newValue
		case 'tablespoons':
			newValue = amount * 15
			return newValue
		case 'cups':
			newValue = amount * 240
			return newValue
		case 'cup':
			newValue = amount * 240
			return newValue
		case 'grams':
			newValue = amount * 1
			return newValue
		case 'milliliters':
			newValue = amount * 1
			return newValue
		case 'liters':
			newValue = amount * 1000
			return newValue
		case 'ounce':
			newValue = amount * 30
			return newValue
		case 'ounces':
			newValue = amount * 15
			return newValue
		case 'pounds':
			newValue = amount * 455
			return newValue
		case 'pound':
			newValue = amount * 455
			return newValue
		case 'lbs':
			newValue = amount * 455
			return newValue
		case 'lb':
			newValue = amount * 455
			return newValue
		default:
			newValue = amount * 100
			return newValue
	}
}

const inputs = readline.question('Input your ingredients: ')

rest.get(`http://localhost:3000/recipeIng/${inputs}`
).on('complete', function(data) {
	for (const i in data.recipeName) {
		console.log(
			'Recipe name: ' + data.recipeName[i] + '\n' +
			'Recipe ID: ' + data.recipeID[i] + '\n' +
			'Ingredients: ' + '\n'
			)
		for (const n in data.recipeIngredients[i]) {
			console.log(
				'Ingredient: ' + data.recipeIngredients[i][n].Ingredient + '\n',
				'Amount: ' + data.recipeIngredients[i][n].Amount + '\n',
				'Unit: ' + data.recipeIngredients[i][n].Unit + '\n'
			)
		}
	}
	const ID = readline.question('Which recipe ID are you interesed in?: ')
	const IDparse = parseInt(ID)
	const Nutrition = []

	async.each(data.recipeIngredients[data.recipeID.indexOf(IDparse)], function(name, callback) {
		const changeSpace = name.Ingredient.replace(/ /g, '-')
		rest.get(`http://localhost:3000/nutrition/${changeSpace}`
	).on('complete', function(Info) {
		Nutrition.push({
			Ingredient: Info.foods.food.food_name,
			Calories_Kcal: (Math.fround(parseInt(Info.foods.food.food_description.split(' ')[Info.foods.food.food_description.split(' ').indexOf('Calories:')+1].split('k')[0])/100) * changeToGrams(name.Unit.toLowerCase(),name.Amount)).toFixed(2),
			Fat_g: (Math.fround(parseInt(Info.foods.food.food_description.split(' ')[Info.foods.food.food_description.split(' ').indexOf('Fat:')+1].split('g')[0])/100) * changeToGrams(name.Unit.toLowerCase(),name.Amount)).toFixed(2),
			Carbs_g: (Math.fround(parseInt(Info.foods.food.food_description.split(' ')[Info.foods.food.food_description.split(' ').indexOf('Carbs:')+1].split('g')[0])/100) * changeToGrams(name.Unit.toLowerCase(),name.Amount)).toFixed(2),
			Protein_g: (Math.fround(parseInt(Info.foods.food.food_description.split(' ')[Info.foods.food.food_description.split(' ').indexOf('Protein:')+1].split('g')[0])/100) * changeToGrams(name.Unit.toLowerCase(),name.Amount)).toFixed(2),
		})
		callback()
	})
	}, function() {
		console.log(Nutrition)
	})
})
