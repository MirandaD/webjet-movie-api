'use strict'
const config = require('config')
const _ = require('lodash')

const GET_MOVIE_LIST_URL = config.GET_MOVIE_LIST_URL

const ERROR_INVALID = 'ERROR_INVALID'

module.exports.create = (externalLib)=>{
    const needle = externalLib.needle
    const getMovieList = function(req, res) {
        const movies = []
        const movieListUrlArray = config.movieListUrls
        const movieListBaseUrl = config.baseUrl

        const getMoviesPromiseArray = []
        movieListUrlArray.forEach(movieListUrl => {
          const fullMovieListUrl = movieListBaseUrl + movieListUrl  
          getMoviesPromiseArray.push(getMoviesByUrl(fullMovieListUrl))
        })
        const getMoviesByUrl = (url)=>{
            if(!url){
                console.log('Missing confituration')
                return Promise.reject(ERROR_INVALID)
            }
            return needle('get', url, function(httpResponse, error){
                if(httpResponse.statusCode === 200){
                    const movieList = _.get(httpResponse, 'body.Movies')
                    movies = _.uniqBy(movies.concat(movieList), 'Title')
                    return
                } else {
                    console.log('Error loading movies from', url)
                    return
                }
            })
        }
        return Promise.all(getMoviesPromiseArray)
        .then(resultMovieArray=>{
            return res.send(resultMovieArray)
        })
    }
    }
    return {
        getMovieList: getMovieList
    }
}