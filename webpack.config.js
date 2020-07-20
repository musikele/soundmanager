const path = require('path');

module.exports = {
    "mode": "development",
    "devtool": "source-map",
    "entry": "./src/index.js",
    module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          }
        ]
    },
    resolve: {
    extensions: ['*', '.js']
    },
    "output": {
        library: 'SoundManager',
        libraryTarget: 'umd',
        filename: 'soundmanager.js',
        path: path.resolve(__dirname, 'dist'),
    }
}