var webpack = require("webpack");

module.exports = {
    context: __dirname,
    entry: "./entry.js",
    devtool: "source-map",
    output: {
        path: __dirname + '/dist',
        publicPath: "/dist/",
        filename: "bundle.js",
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules(\/|\\)/, loader: "babel-loader" },
            { test: /\.less$/, loader: "style-loader!css-loader!less-loader" }
        ]
    },
    resolve: {
        modules: [__dirname, "node_modules"],
        extensions: [".js", ".webpack.js", ".web.js", ".react.js"]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};
