'use strict'

const fav = require ('../Public/Favourites.js')
const expect = require ('chai').expect
const ChaiAsPromised = require('chai-as-promised')
const chai = require('chai')


chai.use(ChaiAsPromised)
chai.should()

describe('Favourites.js', function() {

	describe('getUserID', function() {

		it('Should return the corresponding userID to user input', function() {
			return (fav.getUserID('admin')).should.eventually.equal(1)
		})

		it('Should return an appropriate error message if the user cannot be found', function() {
			return (fav.getUserID('notAuser')).should.eventually.be.rejectedWith('Invalid Username')
		})
	})

	describe('checkRecipes', function() {

		it('Should reject if the recipe is already favourited', function() {
			return (fav.checkRecipes(1, 721001)).should.eventually.be.rejectedWith('Already Favourited')
		})

		it('Should resolve if the recipe is NOT already favourited', function() {
			return (fav.checkRecipes(1, 234234)).should.eventually.be.fulfilled
		})
	})

	describe('addToFavouritesRec', function() {

		it('Should add items to favourites as long as there is no repeating data', function() {
			const nutrition = JSON.stringify({
				'nutritionIng': [{
					'Ingredient': 'test',
					'Calories_Kcal': 1,
					'Fat_g': 1,
					'Carbs_g': 1,
					'Protein_g': 1
				}],
				'totalCal': 1,
				'totalFat': 1,
				'totalCarb': 1,
				'totalProt': 1
			})
			return (fav.addToFavouritesRec(1, 1, nutrition)).should.eventually.equal('Adding to favourites')
		})
	})

	describe('checkIngredients', function() {

		it('Should reject if the ingredients are already in the table (avoid repeating data)', function() {
			return (fav.checkIngredients(696555)).should.eventually.be.rejectedWith('Added to favourites')
		})

		it('Should resolve if the ingredients are not already in the table', function() {
			return (fav.checkIngredients(1)).should.eventually.be.fulfilled
		})
	})

	describe('addToFavouritesIng', function() {
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
		return (fav.addToFavouritesIng(4, nutrition)).should.eventually.equal('Added to favourites')
	})

	describe('viewFavourites', function() {

		it('Should return an object of the users favourites', function() {
			return (fav.viewFavourites(1)).should.eventually.be.fulfilled
		})
	})

	describe('deleteFavRec', function() {

		it('Should delete a favourite from the database', function() {
			fav.deleteFavRec(1,1).then(() => {
				fav.viewFavourites(1).then((result) => {
					expect(result.recipeIDs.indexOf(1)).to.equal(-1)
				})
			})
		})

	})

	describe('deleteFavIng', function() {

		it('Should delete the favourite Ingredients from the database `TESTING PURPOSES ONLY`', function() {
			return (fav.deleteFavIng(4)).should.eventually.be.fulfilled
		})
	})
})
