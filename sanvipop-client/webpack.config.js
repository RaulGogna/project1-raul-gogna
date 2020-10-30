const path = require('path');

module.exports = {
    context: path.join(__dirname, './src'),
    mode: 'development',
    devtool: 'source-map',
    entry: {
        index: './index',
        'add-product': './add-product',
        login: './login',
        register: './register',
        profile: './profile',
        'edit-profile': './edit-profile',
        'product-detail': './product-detail',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname + '/dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            { test: /\.handlebars$/, loader: "handlebars-loader" },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                }],
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: "initial",
                    name: "commons",
                    minChunks: 2,
                    minSize: 0
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },      
    devServer: {
        contentBase: __dirname, // Default (project's root directory)
        publicPath: '/dist/', // Path where bundles are
        compress: true, // Enable gzip compresion when serving content
        port: 8080 // Default
    }
}
