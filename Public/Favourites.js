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

/**
	* Function that gets the users ID based on their username
	* @param {string} username - The users username
	* @return {int} Returns with the userID
 */
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

/**
	* Function that checks if the recipe is already Favourited
	* @param {int} userID - The users userID
	* @param {int} recipeID - The recipe to be Favourited
	* @return {boolean} resolves if the recipe is not already in the favourite_Rec database
 */
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

/**
	* Function that adds the recipe to the favourite_Rec database
	* @param {int} userID - The users userID
	* @param {int} recipeID - The recipe to be Favourited
	* @param {object} nutrition - The relevent data to insert into the database
	* @return {string} appropriate message
 */
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

/**
	* Function to check if the ingredients are already in the favourite_Ing database
	* @param {int} recipeID - The recipeID to check by
	* @return {boolean} resolves if theingredients aren't already in the database
 */
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

/**
	* Function to add favourite ingredients to the database
	* @param {int} recipeID - The relevant recipeID
	* @param {object} nutrition - The relevan nutritional information
	* @return {string} appropriate message
 */
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

/**
	* Function that returns an object of the users favourites
	* @param {int} userID - The users userID
	* @return {object} returns with an object of the users favourites
 */
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

/**
	* Function that deletes a favourite item
	* @param {int} userID - The users ID
	* @param {int} toDelete - The recipeId to deletes
	* @return {string} appropriate message
 */
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

/**
	* Function that deletes favourite ingredients - only used in testing
	* @param {int} recipeID - The ID to deletes
	* @return {boolean} resolves if Deleted
 */
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
