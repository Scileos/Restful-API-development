'use strict'

const readline = require('readline-sync')
const rest = require('restler')

const inputs = readline.question('Input your ingredients: ')

const recipeID = GetIngredients(inputs)

function GetIngredients(inputs) {
	rest.get(`http://137.74.116.221:3000/recipeIng/${inputs}`
).on('complete', function(data) {
	for (const i in data) {
		console.log(
			'Recipe name: ' + data[i].title + '\n' +
			'Used ingredients: ' + data[i].usedIngredientCount + '\n' +
			'Missed ingredients: ' + data[i].missedIngredientCount + '\n'
			)
	}
	const recipeInput = readline.question('Which recipe are you interested in?: ')
	for (const i in data) {
		if (data[i].title === recipeInput) {
			const ID = data[i].id
			return ID
		}
	}
}
)}

rest.get(`http://137.74.116.221:3000/recipe/${recipeID}`
	).on('complete', function(data) {
		console.log(data)

	})
