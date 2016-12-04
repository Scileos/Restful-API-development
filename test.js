'use strict'

const readline = require('readline-sync')
const rest = require('restler')
const FS_API = require ('./Public/FatSecret API - Nutrition.js')
const async = require ('async')

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
	).on('complete', function(data) {
		Nutrition.push({
			Ingredient: data.foods.food.food_name,
			food_description: data.foods.food.food_description
		})
		callback()
	})
	}, function() {
		console.log(Nutrition)
	})
})
