'use strict'

const sql = require('mysql')
const async =require('async')

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
					} if (result.length === 0) {
						reject('Invalid Username')
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
					reject(err)
				}
				for (const i in result) {
					if (result[i].recipe_id === recipeID) {
						reject('Already Favourited')
					}
				}
				resolve()
			})
		})

exports.addToFavouritesRec = (userID, recipeID, nutrition) =>
	new Promise ((resolve, reject) => {
		const query = `INSERT INTO favourite_Rec (user_id, recipe_id, total_cal, total_fat, total_carb, total_prot) VALUES ('${userID}', '${recipeID}', '${nutrition.totalCal}','${nutrition.totalFat}','${nutrition.totalCarb}','${nutrition.totalProt}')`
		pool.query(query, function(err) {
			if (err) {
				reject(err)
			} else {
				resolve('Adding to favourites')
			}
		})
	})


exports.checkIngredients = (recipeID) =>
new Promise ((resolve, reject) => {
	const checkIngData = 'SELECT recipe_id FROM favourite_Ing'
	pool.query(checkIngData, function(err, result) {
		if (err) {
			console.log(err)
		}
		let found = false
		for (const i in result) {
			if(result[i].recipe_id === recipeID) {
				found = true
			}
		}
		if (found === true) {
			reject('Added to favourites')
		} else {
			resolve()
		}
	})
})

exports.addToFavouritesIng = (recipeID, nutrition) =>
new Promise((resolve, reject) => {
	for (const i in nutrition.nutritionIng) {
		const query = `INSERT INTO favourite_Ing (recipe_id, Ingredient, Calories, Fat, Carbs, Protein) VALUES ('${recipeID}', '${nutrition.nutritionIng[i].Ingredient}', '${nutrition.nutritionIng[i].Calories_Kcal}', '${nutrition.nutritionIng[i].Fat_g}', '${nutrition.nutritionIng[i].Carbs_g}',
'${nutrition.nutritionIng[i].Protein_g}')`
		pool.query(query, function(err) {
			if (err){
				reject(err)
			} else {
				resolve('Added to favourites')
			}
		})
	}
})

exports.viewFavourites = (userID) =>
	new Promise ((resolve, reject) => {
		const favObj = {
			recipeIDs: [],
			Ingredients: []
		}
		const query = `SELECT recipe_id FROM favourite_Rec WHERE user_id='${userID}'`
		pool.query(query, function(err, result){
			if (err) {
				reject()
				console.log(err)
			} else {
				for (const i in result) {
					favObj.Ingredients[i] = []
					favObj.recipeIDs[i] = result[i].recipe_id
				}
				async.each(favObj.recipeIDs, function(recipeID, callback){
					const ingQuery = `SELECT Ingredient, Calories, Fat, Carbs, Protein FROM favourite_Ing WHERE recipe_id='${recipeID}'`
					pool.query(ingQuery, function(err, result) {
						if (err) {
							reject('Invalid option')
							console.log(err)
						} else {
							for (const i in result) {
								favObj.Ingredients[favObj.recipeIDs.indexOf(recipeID)][i] = result[i]
							}
							callback()
						}
					})
				}, function() {
					resolve(favObj)
				})
			}
		})
	})

exports.deleteFavRec = (userID, toDelete) =>
	new Promise ((resolve, reject) => {
		const query = `DELETE FROM favourite_Rec WHERE user_id='${userID}' AND recipe_id='${toDelete}'`
		pool.query(query, function(err){
			if (err) {
				reject(err)
			} else {
				resolve('Deleted recipe ' + toDelete + ' from favourites')
			}
		})
	})

exports.deleteFavIng = (recipeID) =>
		new Promise ((resolve, reject) => {
			const query = `DELETE FROM favourite_Ing WHERE recipe_id='${recipeID}'`
			pool.query(query, function(err) {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
