'use strict'

const FS_API = require ('../Public/FatSecret API - Nutrition.js')
const SP_API = require ('../Public/Spoonacular API - Recipes.js')
const index = require ('../index.js')


describe('Index', function() {

	it('should run as a background service and repsond when pinged', () => {
//run server thread through index.js using OVS
//ping OVS server that index.js is running on
//expect a response
//else fail
	})

	it('should throw an error if anything unexpected occurs', () => {
    // expect error if server is not running
	})

})


it('Should be able to retrieve data from the FatSecret API', () => {
	const request = index.server.get('localhost:3000/ingredient/1111')
	expect(request.food.food_name).toBe('Chocolate Rich Ice Cream')
}
	)

it('Should be able to retrieve data from Spoonacular API ', () => {
	expect(index.server.get).toBe(SP_API.GetRequest)
}
)

