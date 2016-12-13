'use strict'

const FS = require ('../Public/FatSecret API - Nutrition.js')
const expect = require ('chai').expect
const ChaiAsPromised = require('chai-as-promised')
const chai = require('chai')

chai.use(ChaiAsPromised)
chai.should()

describe('FatSecret API - Nutrition', function() {

	describe('API_URL', function() {
		
		it('Should insert the search query into the request object', function() {
			expect(FS.API_URL('apple').search_expression).to.equal('apple')
		})
	})


	describe('GetNutrition', function() {

		it('Should get an appropriate response on external GET request', function(){
			return (FS.GetNutrition('apple')).should.eventually.be.fulfilled
		})

	})




})
