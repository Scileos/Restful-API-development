'use strict'
const FS_API = require ('../Public/FatSecret API - Nutrition.js')
const SP_API = require ('../Public/Spoonacular API - Recipes.js')
const MG_API = require ('../Public/Merging API - To Call.js')


describe('Own API', function() {

	it('Should be able to retrieve data from the FatSecret API', () => {
		new Promise ((resolve) => { 
			FS_API.GetRequest().then((request) => {
				expect(MG.GetRequest).toBe(request)
			}
			)}
	)}
	)

	it('Should be able to retrieve data from Spoonacular API ', () => {
		new Promise ((resolve) => { 
			SP_API.GetRequest().then((request) => {
				expect(MG.GetRequest).toBe(request)
			}
			)}
	)}
)}

)
