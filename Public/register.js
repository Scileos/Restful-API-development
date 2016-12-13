'use strict'
const crypto = require('crypto')
const sql = require('mysql')

/** Create constant to enable access to MySQL */

const pool = sql.createPool({
	user: 'admin',
	password: 'LoremIpsum',
	host: '137.74.116.221',
	port: 3306,
	database: '304CEM',
	connectionLimit: 10
})

/**
	* Create a salt for the user
	* @param {string} user - The username
	* @returns {Object} - The salt in an object
*/

exports.checkIfExists = (user) =>
	new Promise((resolve, reject) => {
		const query = `SELECT username FROM users WHERE username='${user}'`
		pool.query(query, function(err, result) {
			if (err) {
				reject(err)
			}
			if (result.length === 0) {
				resolve()
			} else {
				reject('User already exists')
			}
		})
	})


exports.salt = (user) =>
	new Promise((resolve, reject) => {
		genSalt(user).then((salt) => {
			resolve({salt: salt})
		}).catch(() => {
			reject('Could not generate salt')
		})
	})

/**
	* Fills in the blanks for a given user
	* @param {string} user - The username
	* @param {string} hash - The hashed password
	* @returns {object} - The status of the request
*/

exports.final = (user, hash) =>
	new Promise((resolve, reject) => {
		checkBlankPass(user).then(() => {
			appendUser(user, hash).then(() => {
				resolve({success: true})
			})
		}).catch(() => {
			reject('User is already registered')
		})
	})

/**
	* Generates a salt for the user
	* @param {string} user - The username
	*@returns {string} - The generated salt
*/

const genSalt = module.exports.genSalt = (user) =>
	new Promise((resolve, reject) => {
		const saltLength = 16
		crypto.randomBytes(saltLength, function(err, buffer) {
			const salt = buffer.toString('hex')
			if (err) {
				reject(err)
			} else {
				const testQuery = `SELECT username FROM users WHERE username='${user}'`
				pool.query(testQuery, function(err, result) {
					if (err) {
						reject(err)
					}
					if (result.length === 0) {
						const query = `INSERT INTO users (username, Salt) VALUES ('${user}', '${salt}')`
						pool.query(query, function(err) {
						if (err) {
							console.log(err)
							reject(err)
						}	else {
							resolve(salt)
						}
					})
					} else {
						reject('User already registered')
					}
				})
			}
		})
	})

/**
	* Checks that the password field is blanks
	* @param {String} user - The username
	* @returns {Boolean} Resolves if the field is blank otherwise reject
*/

const checkBlankPass = module.exports.checkBlankPass = (user) =>
		new Promise((resolve, reject) => {
			const query = `SELECT HashedPass FROM users WHERE username='${user}'`
			pool.query(query, function(err, result) {
				if (err) {
					console.log(err)
					reject()
				}
				if (result[0].HashedPass === null) {
					resolve()
				} else {
					reject()
				}
			})
		})

/**
	* Appends the data to the user in the table
	* @param {String} user - The username
	* @param {String} hash - The hashed password
	* @returns {Boolean} Resolve if successful, Reject if not
 */
const appendUser = module.exports.appendUser = (user, hash) =>
	new Promise((resolve, reject) => {
		const checkQuery = `SELECT username FROM users WHERE username='${user}'`
		pool.query(checkQuery, function(err, result) {
			if (err) {
				reject(err)
			}
			if(result.length === 0) {
				reject('User not in the database')
			} else {
				const query = `UPDATE users SET HashedPass='${hash}' WHERE username='${user}'`
				pool.query(query, function(err) {
					if (err) {
						console.log(err)
						reject()
					} else {
						resolve()
					}
				})
			}
		})
	})

exports.deleteUser = (user) =>
		new Promise ((resolve, reject) => {
			const query = `DELETE FROM users WHERE username='${user}'`
			pool.query(query, function(err) {
				if (err) {
					reject (err)
				} else {
					resolve()
				}
			})
		})


