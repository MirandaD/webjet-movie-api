'use strict'
const config = require('config')
const _ = require('lodash')
const needleTem = require('needle')
const movieModel = require('./movie-model')({ needle: needleTem })

const ERROR_INVALID = 'ERROR_INVALID'
const ERROR_SERVER_ERROR = 'ERROR_SERVER_ERROR'

module.exports.create = (externalLib) => {
  const needle = externalLib.needle
  const getMovieList = function (req, res) {
    let movies = []
    console.log(config)
    const movieListUrlArray = config.movieApi.movieListUrls
    const movieBaseUrl = config.movieApi.baseUrl
    const reqHeaderOptions = { headers: config.movieApi.headerOptions }

    const getMoviesByUrl = (url) => {
      if (!url) {
        console.log('Missing confituration')
        return Promise.reject(ERROR_INVALID)
      }
      return needle('get', url, reqHeaderOptions)
        .then((response) => {
          if (response.statusCode === 200) {
            const movieList = _.get(response, 'body.Movies')
            movies = movies.concat(movieList)
          } else {
            console.log('Error loading movies from', url, response)
            throw ERROR_SERVER_ERROR
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
    const getMoviesPromiseArray = []
    movieListUrlArray.forEach(movieListUrl => {
      const fullMovieListUrl = movieBaseUrl + movieListUrl
      getMoviesPromiseArray.push(getMoviesByUrl(fullMovieListUrl))
    })
    return Promise.all(getMoviesPromiseArray)
      .then(() => {
        return res.send(movieModel._mergeMovies(movies))
      })
  }

  const getDetailsByTitleAndYear = function (req, res, next){
    const movieObj = _.get(req, 'body')
    if (!movieObj || _.isEmpty(movieObj)) {
      console.log(ERROR_INVALID, req)
      return res.status(400).send()
    }
    return movieModel.getMovieDetailsByMoveObj(movieObj)
      .then((returnRes) => {
        return res.send(returnRes)
      })
      .catch(err => {
        console.log(err)
        return res.status(500).send()
      })
    .catch(next)
  }
  return {
    getMovieList: getMovieList,
    getDetailsByTitleAndYear: getDetailsByTitleAndYear
  }
}
