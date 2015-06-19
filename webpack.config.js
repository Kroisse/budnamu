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
            { test: /\.js$/, exclude: /node_modules(\/|\\)/, loader: "babel" },
            { test: /\.less$/, loader: "style!css!less" }
        ]
    },
    resolve: {
        root: __dirname,
        modulesDirectories: ["web_modules", "node_modules"],
        extensions: ["", ".webpack.js", ".web.js", ".js", ".react.js"]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};
