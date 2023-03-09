import { Request, Response } from 'express'
import setCookie, { CookieMap } from 'set-cookie-parser'
import cookieParser from 'cookie-parser'
import decache from 'decache'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'
import { merge } from 'webpack-merge'
import { MultiCompiler } from 'webpack'
import path from 'path'
import serverConfig from './server'
import webappConfig from './webapp'

const indexFilepath = path.resolve(__dirname, '../dist/index.js')

const devServer: DevServerConfiguration = {
    client: {
        progress: true,
    },
    devMiddleware: {
        index: true,
        serverSideRender: true,
        writeToDisk(filepath) {
            // write index.js and manifest.json which will be used to import handler.
            // decache will be used to allow dynamic import of the handler whenever the files change.
            return /(index\.js)|(manifest\.json)$/.test(filepath)
        },
    },
    host: 'localhost',
    liveReload: true,
    onListening(devServer) {
        ;(devServer.compiler as MultiCompiler).compilers
            .find(({ name }) => name === 'server')!
            .hooks.afterCompile.tap('DecacheIndex', () => decache(indexFilepath))
    },
    setupMiddlewares(middlewares, devServer) {
        devServer!.app!.use(cookieParser())

        middlewares.push(async (req: Request, res: Response) => {
            import(indexFilepath)
                .then(async ({ handler }) => {
                    // adapt between express Request/Response and Lambda.
                    // I can't believe there's not already a library that can do this for me. Most libraries out there
                    // handle the opposite conversion (convert a Lambda request into something Express can handle) while
                    // I need something that translate an Express request into a Lambda request and context.
                    // TODO if you need more fields from AWS Lambda request and context parameters, add them here.
                    const originalUrl = req.originalUrl
                    const indexOfQuery = originalUrl.indexOf('?')
                    const { cookies, headers, body, statusCode } = await handler(
                        {
                            rawPath: req.path,
                            rawQueryString: indexOfQuery >= 0 ? req.originalUrl.substring(indexOfQuery + 1) : '',
                            queryStringParameters: req.query,
                            cookies: Object.entries(req.cookies || {}).map(([key, value]) => `${key}=${value}`),
                            headers: {
                                'x-forwarded-for': req.ip,
                            },
                            requestContext: {
                                timeEpoch: Math.ceil(new Date().getTime() / 1000),
                            },
                        },
                        {}
                    )

                    // AWS Lambda response's Cookies contains the entries that are Set-Cookie values such as:
                    // sid=1245; Secure; HttpOnly; SameSite=Lax.
                    // we'll use set-cookie-parse to parse them into something express can use.
                    const cookieMap: CookieMap = setCookie.parse(cookies, { map: true })
                    Object.entries(cookieMap).forEach(([name, cookie]) =>
                        res.cookie(name, cookie.value, {
                            expires: cookie.expires,
                            httpOnly: cookie.httpOnly,
                            path: cookie.path,
                            sameSite: 'lax',
                            secure: cookie.secure,
                        })
                    )
                    Object.entries(headers || {}).forEach(([key, value]) => res.header(key, value as string))
                    res.status(statusCode)
                    res.send(body)
                })
                .catch((err) => {
                    console.trace(err)
                    res.status(500)
                    res.send(err)
                })
        })

        return middlewares
    },
    port: 3000,
    server: 'https',
    static: {
        directory: path.join(__dirname, '../public'),
        serveIndex: false,
    },
    watchFiles: {
        paths: ['../src/**/*', '../public/**/*'],
        options: {
            usePolling: false,
        },
    },
}

export default [merge(serverConfig, { devServer }), webappConfig]
