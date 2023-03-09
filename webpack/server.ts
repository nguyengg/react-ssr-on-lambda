import { devConfig, prodConfig } from './common'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import path from 'path'

const config: Configuration = merge(process.env.NODE_ENV === 'production' ? prodConfig() : devConfig(), {
    entry: {
        server: path.resolve(__dirname, '../src/server/index.ts'),
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
                        lib: ['es2020', 'dom'],
                        module: 'node16',
                        moduleResolution: 'node',
                        resolveJsonModule: true,
                        skipLibCheck: true,
                        target: 'es2020',
                    },
                },
            },
        ],
    },
    name: 'server',
    output: {
        filename: 'index.js',
        chunkFilename: 'index.js',
        library: {
            name: 'index',
            type: 'umd',
        },
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
    },
    target: 'node',
})

export default config
