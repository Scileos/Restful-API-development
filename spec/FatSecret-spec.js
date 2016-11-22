'use strict'
const API = require ('../Public/FatSecret API - Nutrition.js')


describe('Fat Secret', function() {

	it('should return food_id on a GET request', () => {
		API.GetRequest().then((request) => {
			expect(request).toBe('Strained Noodles and Chicken Vegetables Dinner Babyfood')
		})
	})

	it('Should fail if the food_id is not valid '), () => {
		API.GetRequest().then((request) => {
			expect(request).toBe(Error)
		})
	}


})
