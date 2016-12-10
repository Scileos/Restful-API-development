'use strict'

const sql = require('mysql')
const crypto = require('crypto')

/** Create constant to enable access to MySQL */

const pool = sql.createPool({
	user: 'admin',
	password: 'LoremIpsum',
	host: '137.74.116.221',
	port: 3306,
	database: '304CEM',
	connectionLimit: 10
})

exports.checkUser = (user) =>
	new Promise((resolve, reject) => {
		const slt_query = `SELECT salt FROM users WHERE username='${user}'`
		pool.query(slt_query, function(err, result) {
			if (err) {
				reject('Invalid Username')
			} else {
				resolve(result)
			}
		})
	})

exports.checkPass = (user, pass, salt) =>
new Promise((resolve, reject) => {
	const hashedPass = pass + salt
	const query = `SELECT HashedPass FROM users WHERE username='${user}'`
	pool.query(query, function(err, result) {
		if (err) {
			reject('Invalid Password')
		} else {
			if (hashedPass === result[0].HashedPass) {
				resolve()
			} else {
				reject('Invalid Password')
			}
		}
	})
})

exports.updatePassword = (userID, newPass) =>
new Promise ((resolve, reject) => {
	const saltLength = 16
	crypto.randomBytes(saltLength, function(err, buffer) {
		if (err) {
			reject(err)
		} else {
			const newSalt = buffer.toString('hex')
			const updateSalt = `UPDATE users SET Salt='${newSalt}' WHERE user_id='${userID}'`
			pool.query(updateSalt, function(err) {
				if (err) {
					reject(err)
				} else {
					const newHashed = newPass + newSalt
					const updateHashed = `UPDATE users SET HashedPass='${newHashed}' WHERE user_id='${userID}'`
					pool.query(updateHashed, function(err) {
						if (err) {
							reject(err)
						} else {
							resolve ('Password Updated')
						}
					})
				}
			})
		}
	})
})
