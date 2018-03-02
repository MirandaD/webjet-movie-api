'use strict'
const _ = require('lodash')
const config = require('config')
module.exports = (externalLib) => {
  const needle = externalLib.needle

  const reqHeaderOptions = {
    headers: config.movieApi.headerOptions,
    accept: 'application/json',
    content_type: 'application/json'
  }
  const movieListUrlArray = config.movieApi.movieListUrls
  const movieDetailUrlArray = config.movieApi.movieDetailUrl
  const movieBaseUrl = config.movieApi.baseUrl

  const _mergeMovies = function (movies) {
    // assume movie.Title + movie.year would uniqually define a movie.
    const resMovieList = []
    movies.forEach(movie => {
      const existingInListIndex = _.findIndex(resMovieList, { Title: movie.Title, Year: movie.Year })
      if (existingInListIndex > -1) {
        resMovieList[existingInListIndex].ID.push(movie.ID)
      } else {
        const movieObj = {
          Title: movie.Title,
          Year: movie.Year,
          ID: [movie.ID],
          Type: movie.Type,
          Poster: movie.Poster
        }
        resMovieList.push(movieObj)
      }
    })
    return resMovieList
  }
  const getMovieDetailsByMoveObj = function (movieObj) {
    const movieIdList = movieObj.ID
    const movieDetail = {prices: []}

    const getMovieDetailsByIdAndUrl = (movieId, url) => {
      return needle('get', url, reqHeaderOptions)
        .then(response => {
          console.log(url, response.body.toString())
          if (response.statusCode === 200) {
            _.assign(movieDetail, response.body)
            const price = response.body.Price
            movieDetail.prices.push({ url: url, price: price })
          }
        })
        .catch(() => {
          // error handle
        })
    }
    const getMovieSourceUrlById = (movieId) => {
      // movieDetailUrlArray
      let movieSource = 'cinemaworld'
      if (movieId.indexOf('fw') > -1) {
        movieSource = 'filmworld'
      }
      const movieSourceUrl = _.find(movieDetailUrlArray, (url) => { return url.indexOf(movieSource) > -1 })

      return movieBaseUrl + movieSourceUrl.replace('{id}', movieId)
    }
    const getMovieDetailsPromiseArray = []
    movieIdList.forEach(movieId => {
      const movieDetailUrl = getMovieSourceUrlById(movieId)
      getMovieDetailsPromiseArray.push(getMovieDetailsByIdAndUrl(movieId, movieDetailUrl))
    })

    return Promise.all(getMovieDetailsPromiseArray)
      .then(() => {
        return movieDetail
      })
  }
  return {
    _mergeMovies: _mergeMovies,
    getMovieDetailsByMoveObj: getMovieDetailsByMoveObj
  }
}
