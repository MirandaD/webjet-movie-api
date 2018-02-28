'use strict'
const express = require('express')
const MovieController = require('./movie-controller')
const app = express()
const needle = require('needle')

const movieController = MovieController.create({
    needle: needle
})
app.get('/movie-list', movieController.getMovieList)

app.get('/movie/:movieId', (req, res) => {
    
})
app.listen(3001, () => {
    console.log('webjet-movie-api starts at 3001')
})

