'use strict'

const auth = require('./Public/auth.js')
const FS = require('./Public/FatSecret API - Nutrition.js')
const SP = require ('./Public/Spoonacular API - Recipes.js')
const fav = require ('./Public/Favourites.js')

const nutrition = {
				nutritionIng: [{
					Ingredient: 'test',
					Calories_Kcal: 1,
					Fat_g: 1,
					Carbs_g: 1,
					Protein_g: 1
				}],
				totalCal: 1,
				totalFat: 1,
				totalCarb: 1,
				totalProt: 1
}

fav.addToFavouritesRec(1, 1, nutrition).then((result) => {
	console.log(result)
})
