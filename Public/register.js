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

exports.salt = (user) =>
	new Promise((resolve, reject) => {
		genSalt(user).then((salt) => {
			resolve({salt: salt})
		}).catch(() => {
			reject({success: false, data: 'Could not generate salt.'})
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

const genSalt = (user) =>
	new Promise((resolve, reject) => {
		const saltLength = 16
		crypto.randomBytes(saltLength, function(err, buffer) {
			const salt = buffer.toString('hex')
			if (err) {
				reject(err)
			} else {
				const query = `INSERT INTO users (username, Salt) VALUES ('${user}', '${salt}')`
				pool.query(query, function(err) {
					if (err) {
						console.log(err)
						reject(err)
					}	else {
						resolve(salt)
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

const checkBlankPass= (user) =>
		new Promise((resolve, reject) => {
			const query = `SELECT HashedPass FROM users WHERE username='${user}' AND HashedPass IS NULL`
			pool.query(query, function(err) {
				if (err) {
					console.log(err)
					reject()
				} else {
					resolve()
				}
			})
		})

/**
	* Appends the data to the user in the table
	* @param {String} user - The username
	* @param {String} hash - The hashed password
	* @returns {Boolean} Resolve if successful, Reject if not
 */
const appendUser = (user, hash) =>
	new Promise((resolve, reject) => {
		const query = `UPDATE users SET HashedPass='${hash}' WHERE username='${user}'`
		pool.query(query, function(err) {
			if (err) {
				console.log(err)
				reject()
			} else {
				resolve()
			}
		})
	})


