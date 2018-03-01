module.exports = {
  port: 3001,
  movieApi: {
    headerOptions: { 'x-access-token': 'sjd1HfkjU83ksdsm3802k' },
    baseUrl: 'http://webjetapitest.azurewebsites.net',
    movieListUrls: ['/api/cinemaworld/movies', '/api/filmworld/movies'],
    movieDetailUrl: ['/api/cinemaworld/movie/{id}', '/api/filmworld/movie/{id}']
  }
}
