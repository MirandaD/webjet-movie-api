'use strict'
const express = require('express')
const MovieController = require('./movie-controller')
const app = express()
const needle = require('needle')
const bodyParser = require('body-parser')

const movieController = MovieController.create({
  needle: needle
})
app.use(bodyParser.json())      // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))
app.get('/movie-list', movieController.getMovieList)

app.post('/movie', movieController.getDetailsByTitleAndYear)
app.listen(3001, () => {
  console.log('webjet-movie-api starts at 3001')
})
