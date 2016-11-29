'use strict'

const readline = require('readline-sync')
const index = require('./index.js')
const rest = require('restler')

const inputs = readline.question('Input your ingredients: ')
rest.get(`137.74.116.221/recipe/${inputs}`)
