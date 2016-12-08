'use strict'
const crypto = require('crypto')
const sql = require('mysql')

const pool = sql.createPool({
	user: 'admin',
	password: 'LoremIpsum',
	host: '137.74.116.221',
	port: 3306,
	database: '304CEM',
	connectionLimit: 10
})

exports.salt = (user) =>
	new Promise((resolve, reject) => {
		genSalt(user).then((salt) => {
			resolve({salt: salt})
		}).catch(() => {
			reject({success: false, data: 'Could not generate salt.'})
		})
	})

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

const checkBlankPass= (user) =>
		new Promise((resolve, reject) => {
			const query = `SELECT HashedPass FROM users WHERE username='${user}' AND HashedPass IS NULL`
			pool.query(query, function(err, result) {
				if (err) {
					console.log(err)
					reject()
				} else {
					resolve()
				}
			})
		})

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


