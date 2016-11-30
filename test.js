'use strict'

const readline = require('readline-sync')
const rest = require('restler')

const inputs = readline.question('Input your ingredients: ')

const recipeID = GetIngredients(inputs)


function GetIngredients(inputs) {
	return new Promise((resolve) => {
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
			resolve(ID)
		}
	}
}
)}
)}

recipeID.then((data) => {
	rest.get(`http://137.74.116.221:3000/recipe/${data}`
	).on('complete', function(data) {
		for (const i in data.extendedIngredients)
			if (data.extendedIngredients[i].unitLong === '') {
				console.log(data.extendedIngredients[i].amount + ' ' + data.extendedIngredients[i].name)
			} else {
				console.log(data.extendedIngredients[i].amount + ' ' + data.extendedIngredients[i].unitLong + ' of ' + data.extendedIngredients[i].name)
			}
	})
})
