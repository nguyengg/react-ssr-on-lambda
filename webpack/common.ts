import { Configuration } from 'webpack'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import { merge } from 'webpack-merge'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'

const common = (production: boolean): Configuration => ({
    module: {
        rules: [
            {
                test: /\.module\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: production,
                        },
                    },
                    'resolve-url-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                outputStyle: 'compressed',
                            },
                            sourceMap: production,
                        },
                    },
                ],
            },
            {
                test: /\.s?css$/,
                exclude: /\.module\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            sourceMap: production,
                        },
                    },
                    'resolve-url-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                outputStyle: 'compressed',
                            },
                            sourceMap: production,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                },
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'css/fonts/[name][ext]',
                },
            },
        ],
    },
    plugins: [new ESLintPlugin()],
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, '../src'),
        },
    },
})
export const devConfig = (): Configuration =>
    merge(common(false), {
        devtool: 'inline-source-map',
        mode: 'development',
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
                chunkFilename: 'css/[name].css',
            }),
        ],
        output: {
            filename: 'js/[name].js',
            chunkFilename: 'js/[name].js',
        },
        stats: 'minimal',
    })

export const prodConfig = (): Configuration =>
    merge(common(true), {
        devtool: 'source-map',
        mode: 'production',
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    terserOptions: {
                        output: {
                            comments: false,
                        },
                    },
                }),
                new CssMinimizerPlugin(),
            ],
        },
        output: {
            filename: 'js/[name]-[contenthash].min.js',
            chunkFilename: 'js/[name]-[contenthash].min.js',
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'css/[name]-[contenthash].min.css',
                chunkFilename: 'css/[name]-[contenthash].min.css',
            }),
        ],
        stats: 'normal',
    })
