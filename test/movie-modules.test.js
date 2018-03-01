'use strict'
const expect = require('chai').expect
/* globals describe,it */

const movielModels = require('../movie-model')()

describe('#_mergeMovies', function () {
  it('should merge movies with same title and year and include all the ids', () => {
    const movieList = [
      { 'Title': 'Star Wars: Episode IV - A New Hope', 'Year': '1977', 'ID': 'cw0076759', 'Type': 'movie', 'Poster': 'http://abc' },
      { 'Title': 'Star Wars: Episode V - The Empire Strikes Back', 'Year': '1980', 'ID': 'cw0080684', 'Type': 'movie', 'Poster': 'http://abcd.jpg' },
      { 'Title': 'Star Wars: Episode IV - A New Hope', 'Year': '1977', 'ID': 'fw0076759', 'Type': 'movie', 'Poster': 'http://abc' }
    ]
    const resMovieList = movielModels._mergeMovies(movieList)
    expect(resMovieList).to.have.length(2)
    expect(resMovieList[0].ID).to.deep.equal(['cw0076759', 'fw0076759'])
    expect(resMovieList[1].ID).to.deep.equal(['cw0080684'])
  })
})
