'use strict'
const config = require('config')

const GET_MOVIE_LIST_URL = config.GET_MOVIE_LIST_URL

module.exports.create = (externalLib)=>{
    const needle = externalLib.needle
    const getMovieList = function(req, res) {
        return new Promise((resolve, reject)=>{
            needle.get(GET_MOVIE_LIST_URL, function(httpResponse, error){
                if(httpResponse.statusCode === 200){
                    return resolve(httpResponse.body)
                } else {
                    
                }
            })
        })
    }
}