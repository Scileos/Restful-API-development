'use strict'

const sql = require('mysql')

/** Create constant to enable access to MySQL */

const pool = sql.createPool({
	user: 'admin',
	password: 'LoremIpsum',
	host: '137.74.116.221',
	port: 3306,
	database: '304CEM',
	connectionLimit: 10
})

exports.getUserID = (username) =>
			new Promise((resolve, reject) => {
				const getUserID = `SELECT user_id FROM users WHERE username='${username}'`
				pool.query(getUserID, function(err, result) {
					if (err) {
						reject(err)
					} else {
						resolve(result[0].user_id)
					}
				})
			})

exports.checkRecipes = (userID, recipeID) =>
		new Promise ((resolve, reject) => {
			const checkRecipes = `SELECT recipe_id FROM favourite_Rec WHERE user_id='${userID}'`
			pool.query(checkRecipes, function(err, result) {
				if (err) {
					console.log(err)
				} else {
					for (const i in result) {
						if (result[i].recipe_id === recipeID) {
							reject('Already Favourited')
						}
					}
				}
				resolve()
			})
		})

exports.addToFavourites = (userID, recipeID, nutrition) => {
	const query = `INSERT INTO favourite_Rec (user_id, recipe_id, total_cal, total_fat, total_carb, total_prot) VALUES ('${userID}', '${recipeID}', '${nutrition.totalCal}','${nutrition.totalFat}','${nutrition.totalCarb}','${nutrition.totalProt}')`
	pool.query(query)
	new Promise ((resolve, reject) => {
		const checkIngData = 'SELECT recipe_id FROM favourite_Ing'
		pool.query(checkIngData, function(err, result) {
			if (err) {
				console.log(err)
			} else {
				for (const i in result) {
					if(result[i].recipe_id === recipeID) {
						reject('Added to favourites')
					}
				}
			}
			resolve('Added to favourites')
		})
	}).then(() => {
		for (const i in nutrition.nutritionIng) {
			const query = `INSERT INTO favourite_Ing (recipe_id, Ingredient, Calories, Fat, Carbs, Protein) VALUES ('${recipeID}', '${nutrition.nutritionIng[i].Ingredient}', '${nutrition.nutritionIng[i].Calories_Kcal}', '${nutrition.nutritionIng[i].Fat_g}', '${nutrition.nutritionIng[i].Carbs_g}',
'${nutrition.nutritionIng[i].Protein_g}')`
			pool.query(query, function(err) {
				if (err){
					console.log(err)
				}
			})
		}
	})
}
