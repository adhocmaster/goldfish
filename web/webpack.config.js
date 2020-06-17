var path = require("path");
var config = {
  mode: "production",

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  entry: ["./src/index.tsx"],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
        {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: "ts-loader"
                }
            ]
        },
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        
        { 
          test: /\.txt$/, 
          use: 'raw-loader' 
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i, 
          loader: "file-loader?name=/public/icons/[name].[ext]"
        }
    ]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
};

module.exports = config;