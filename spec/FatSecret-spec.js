'use strict'
const API = require ('../Public/FatSecret API - Nutrition.js')


describe('Fat Secret', function() {
	it('should return data on a GET request', () => {
		API.GetRequest().then((request) => {
			expect(request).toBe('Strained Noodles and Chicken Vegetables Dinner Babyfood')
		})
	})
})
