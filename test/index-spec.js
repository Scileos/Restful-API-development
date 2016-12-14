'use strict'

const index = require ('../index.js')
const reg = require ('../Public/register.js')
const expect = require ('chai').expect
const ChaiAsPromised = require('chai-as-promised')
const fav = require('../Public/favourites.js')
const chaiHttp = require('chai-http')
const chai = require('chai')


chai.use(ChaiAsPromised)
chai.use(chaiHttp)
chai.should()

describe('index.js', function() {
	this.timeout(2500)

	describe('/GET nutrition', function() {
		it('Should get the nutrition based on the recipeID parameter', (done) => {
			chai.request(index)
						.get('/nutrition/721001')
						.end((err, res) => {
							if (err) {
								console.log(err)
							}
							expect(res).to.have.status(200)
							done()
						})
		})
	})

	describe('/GET favourites', function() {
		it('Should get the favourites for the username in the user paramater', function(done) {
			chai.request(index)
				.get('/view/favourites/admin')
				.end((err, res) => {
					if (err) {
						console.log(err)
					}
					expect(res).to.have.status(200)
					done()
				})
		})
	})

	describe('/GET Ingredients', function() {
		it('Should get a result of recipes based on the params input', function(done) {
			chai.request(index)
				.get('/recipeIng/apple')
				.end((err, res) => {
					if (err) {
						console.log(err)
					}
					expect(res).to.have.status(200)
					done()
				})
		})
	})

	describe('/POST user and salt', function() {

		it('Should register a new user and their salt', function(done) {
			const data = 'specTest'
			chai.request(index)
			.post('/register/salt')
			.send(data)
			.end((err, res) => {
				if (err) {
					console.log(err)
				}
				expect(res).to.have.status(200)
				done()
			})
		})
	})

	describe('/POST HashedPass', function() {

		afterEach(function() {
			reg.deleteUser('specTest')
		})

		it('Should register a users password', function(done) {
			const data = JSON.stringify({
				'user': 'specTest',
				'hashedPass': 'hashedPass'
			})
			chai.request(index)
		.post('/register/user')
		.send(data)
		.end((err, res) => {
			if (err) {
			 console.log(err)
			}
			expect(res).to.have.status(200)
			done()
		})
		})
	})

	describe('/POST auth', function() {

		it('Should resolve if authentication is successful', function(done) {
			const data = JSON.stringify({
				'user': 'admin',
				'pass': 'LoremIpsum'
			})
			chai.request(index)
		.post('/auth')
		.send(data)
		.end((err, res) => {
			if (err) {
				console.log(err)
			}
			expect(res).to.have.status(200)
			done()
		})
		})
	})

	describe('/POST favourites', function() {

		afterEach(function() {
			fav.deleteFavIng(700)
		})

		it('Should post a result to the users favourites', function(done) {
			const	data = JSON.stringify({
				'user': 'test_account',
				'recipeID': 700,
				'nutrition': {
					'nutritionIng': [{
						'Ingredient': 'test',
						'Calories_Kcal': 1,
						'Fat_g': 1,
						'Carbs_g': 1,
						'Protein_g': 1
					}],
					'totalCal': '1',
					'totalFat': '1',
					'totalCarb': '1',
					'totalProt': '1'
				}
			})
			chai.request(index)
		.post('/favourite')
		.send(data)
		.end((err, res) => {
			if (err) {
				console.log(err)
			}
			expect(res).to.have.status(200)
			done()
		})
		})
	})

	describe('/DELETE favourite', function() {

		it('Should delete a favourite item from the database based on the input params', function(done) {
			const data = JSON.stringify({
				'user': 'test_account',
				'recipeID': 700
			})
			chai.request(index)
			.delete('/delFav')
			.send(data)
			.end((err, res) => {
				if (err) {
					console.log(err)
				}
				expect(res).to.have.status(200)
				done()
			})

		})
	})

	describe('/PUT update password', function() {

		it('Should update a users password', function(done) {
			const data =JSON.stringify({
				'newPass': 'newPass'
			})
			chai.request(index)
		.put('/updatePass/test_account')
		.send(data)
		.end((err, res) => {
			if (err) {
				console.log(err)
			}
			expect(res).to.have.status(200)
			done()
		})
		})
	})
})
