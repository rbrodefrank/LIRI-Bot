console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
    key: OMDB_API_KEY
}

exports.bands = {
    key: BANDS_API_KEY
}