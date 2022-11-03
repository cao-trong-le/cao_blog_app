modules.exports = {
  // Other rules...

  resolve: {
    fallback: { 
      path: require.resolve("path-browserify"),
    }
  }
}