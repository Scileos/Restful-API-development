'use strict'

const SP = require ('../Public/Spoonacular API - Recipes.js')
const expect = require ('chai').expect
const ChaiAsPromised = require('chai-as-promised')
const chai = require('chai')

chai.use(ChaiAsPromised)
chai.should()

describe ('Spoonacular API - Recipes.js', function() {

	describe ('Recipe_URL', function() {

		it ('Should create an appropriate URL to call the external API', function() {
			const ingredientString = 'apple'
			expect(SP.Recipe_URL(ingredientString)).to.equal(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=${ingredientString}&limitLicense=false&number=15&ranking=1`)
		})
	})

	describe('GetRecipes', function() {

		it('Should be able to send external Get requests and return appropriate data', function() {
			return (SP.GetRecipes('apple')).should.eventually.be.fulfilled
		})
	})

	describe('searchById', function() {

		it('Should be able to send external GET requests and return appropriate data', function() {
			return (SP.searchById('721001')).should.eventually.be.fulfilled
		})
	})
})

