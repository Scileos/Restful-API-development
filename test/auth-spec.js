'use strict'

const auth = require ('../Public/auth.js')
const expect = require ('chai').expect
const ChaiAsPromised = require('chai-as-promised')
const chai = require('chai')

chai.use(ChaiAsPromised)
chai.should()

describe('auth.js', function() {
	describe('checkUser', function() {

		it('Should return with the users salt if the user exists in the SQL database', function() {
			auth.checkUser('admin').then((result) => {
				expect(result[0].salt).to.equal('5d599f1e26102d9f21c381278ae2b8d0')
			})
		})

		it('Should return `Invalid Username` if the user doesn`t exist in the database', function() {
			return (auth.checkUser('sfgdfgdfg')).should.eventually.be.rejectedWith('Invalid username')
		})

		it('Should return `Invalid Username` if the username is similar but still not in the database', function() {
			return (auth.checkUser('adminnn')).should.eventually.be.rejectedWith('Invalid username')
		})

		it('Should reject with an error message if an error occurs', function() {
			const err = new Error
			expect(auth.checkUser(err)).to.be.rejected
		})

	})

	describe('checkPass', function() {

		it('Should resolve if the users password matches the one stored in the database', function() {
			const checkPass = auth.checkPass('admin', 'LoremIpsum', '5d599f1e26102d9f21c381278ae2b8d0')
			return expect(checkPass).to.be.fulfilled
		})

		it('Should reject if the password does not match and the username is bad', function() {
			return (auth.checkPass('NotAUser', 'NotAPassword', '6d599f1e26102d9f21c381278ae2b8d0')).should.eventually.be.rejectedWith('Invalid Password')
		})

		it('Should reject if the password does not match and the username is good', function() {
			return (auth.checkPass('Jonathan', 'NotAPassword', '6d599f1e26102d9f21c381278ae2b8d0')).should.eventually.be.rejectedWith('Invalid Password')
		})

		it('Should reject with an error message if an error occurs', function() {
			expect(auth.checkPass({object: 'objcet fail'})).to.be.rejected
		})
	})

	describe('updatePassword', function() {

		it('Should reject with an error message if an error occurs', function() {
			return (auth.updatePassword('fakedata', {object: 'fakeData'})).should.eventually.be.rejectedWith('Invalid Input')
		})

		it('Should resolve with a confirmation message if the query is successful', function() {
			return (auth.updatePassword('3', 'newTest')).should.eventually.equal('Password Updated')
		})
	})
})
