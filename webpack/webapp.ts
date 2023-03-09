import { devConfig, prodConfig } from './common'
import CopyPlugin from 'copy-webpack-plugin'
import { merge } from 'webpack-merge'
import path from 'path'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'

const config = merge(process.env.NODE_ENV === 'production' ? prodConfig() : devConfig(), {
    entry: {
        webapp: path.resolve(__dirname, '../src/pages/entry.tsx'),
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        extends: path.resolve(__dirname, '../../tsconfig.json'),
                        lib: ['dom'],
                        module: 'es2020',
                        moduleResolution: 'node',
                        target: 'es5',
                    },
                },
            },
        ],
    },
    name: 'webapp',
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'public' },
                { from: 'node_modules/bootstrap-icons/bootstrap-icons.svg', to: 'images/bootstrap-icons.svg' },
            ],
        }),
        new WebpackManifestPlugin({
            fileName: 'manifest.json',
            basePath: '/',
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
    },
    target: 'web',
})

export default config
