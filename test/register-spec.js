'use strict'

/*global after: true */

const reg = require ('../Public/register.js')
const ChaiAsPromised = require('chai-as-promised')
const chai = require('chai')


chai.use(ChaiAsPromised)
chai.should()

describe('register.js', function() {

	describe('checkIfExists', function() {

		it('Should resolve if the user doesn`t exist already', function() {
			return (reg.checkIfExists('notRegistered')).should.eventually.be.fulfilled
		})

		it('Should reject if the user already exists', function() {
			return (reg.checkIfExists('admin')).should.eventually.be.rejectedWith('User already exists')
		})
	})

	describe('genSalt', function() {

		after(function() {
			reg.deleteUser('notRegistered')
		})

		it('Should resolve with a generated salt', function() {
			return (reg.genSalt('notRegistered')).should.eventually.be.fulfilled
		})
	})

	describe('salt', function() {

		after(function() {
			reg.deleteUser('notRegisteredd')
		})

		it('Should return with the valid salt', function() {
			return (reg.salt('notRegisteredd')).should.eventually.be.fulfilled
		})

		it('Should reject if there is an error', function() {
			return (reg.salt('test_account')).should.eventually.be.rejected
		})
	})

	describe('checkBlankPass', function() {

		it('Should reject if password is not blank', function() {
			return (reg.checkBlankPass('test_account')).should.eventually.be.rejected
		})

		it('Should resolve if the password is blank', function() {
			return (reg.checkBlankPass('blankHash')).should.eventually.be.fulfilled
		})
	})

	describe('appendUser', function() {

		it('Should update a user with their hashed password', function() {
			return (reg.appendUser('blankHashtest', 'testHash')).should.eventually.be.fulfilled
		})

		it('Should reject if the user doesn`t exist', function() {
			return (reg.appendUser('fsdfsdfsdf', 'sdfsdfsdf')).should.eventually.be.rejectedWith('User not in the database')
		})
	})

	describe('final', function() {
		after(function() {
			reg.deleteUser('userTest')
		})

		it('Should add a user to the database', function() {
			reg.salt('userTest').then(() => {
				console.log('')
				return (reg.final('userTest', 'testHash')).should.eventually.be.fulfilled
			})
		})

		it('Should reject if the user is already in the database', function() {
			return(reg.final('Jonathan', 'test')).should.eventually.be.rejectedWith('User is already registered')
		})
	})
})
