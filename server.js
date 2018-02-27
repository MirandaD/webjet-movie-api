'use strict'
const express = require('express')
const movieController = require('./movie-controller')
const app = express()
const needle = require('needle')

app.get('/movie-list', (req, res) => {

})

app.get('/movie/:movieId', (req, res) => {
    
})
app.listen(3001, () => {
    console.log('webjet-movie-api starts at 3001')
})

