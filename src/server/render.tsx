import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import React, { ReactNode, StrictMode } from 'react'
import { renderToPipeableStream, RenderToPipeableStreamOptions } from 'react-dom/server'
import crypto from 'crypto'
import getRawBody from 'raw-body'
import { manifest } from './manifest'
import { PassThrough } from 'stream'
import { StaticRouter } from 'react-router-dom/server'

export default async function render(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> {
    const nonce = crypto.randomBytes(12).toString('base64url')

    return {
        headers: {
            'cache-control': 'private, no-cache',
            'content-security-policy': ` \
default-src 'self'; \
script-src 'self' 'nonce-${nonce}'; \
style-src 'self'; \
style-src-elem 'self'; \
font-src 'self'; \
frame-ancestors 'none'; \
frame-src 'self'; \
img-src 'self' data:; \
media-src 'self' blob:; \
`.trim(),
            'content-type': 'text/html; charset=utf-8',
            'X-Content-Type-Options': 'nosniff',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
        },
        body: (
            await renderImpl(
                <html lang="en" data-bs-theme="dark">
                    <head>
                        <meta charSet="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
                        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
                        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
                        {manifest['/webapp.css'] && <link rel="stylesheet" href={manifest['/webapp.css']} />}
                        <link rel="prefetch" as="image" href="/images/bootstrap-icons.svg" type="images/svg+xml" />
                    </head>

                    <body>
                        <div id="app">
                            <StaticRouter location={event.rawPath}>
                                <StrictMode></StrictMode>
                            </StaticRouter>
                        </div>

                        {process.env.NODE_ENV === 'production' ? (
                            <>
                                <script
                                    nonce={nonce}
                                    src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"
                                    integrity="sha256-S0lp+k7zWUMk2ixteM6HZvu8L9Eh//OVrt+ZfbCpmgY="
                                    crossOrigin="anonymous"
                                />
                                <script
                                    nonce={nonce}
                                    src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"
                                    integrity="sha256-IXWO0ITNDjfnNXIu5POVfqlgYoop36bDzhodR6LW5Pc="
                                    crossOrigin="anonymous"
                                />
                            </>
                        ) : (
                            <>
                                <script
                                    nonce={nonce}
                                    src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.development.js"
                                    integrity="sha256-hXNk4rmCMYQXAl+5tLg1XAn3X6RroL6T9SD3afZ1eng="
                                    crossOrigin="anonymous"
                                />
                                <script
                                    nonce={nonce}
                                    src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.development.js"
                                    integrity="sha256-bRHakm3eFVwNh3OuDgW7ZGg/H0DU4etihxfdhJkXIoI="
                                    crossOrigin="anonymous"
                                />
                            </>
                        )}
                    </body>
                </html>,
                {
                    bootstrapScripts: [manifest['/webapp.js']],
                    nonce,
                }
            )
        ).toString('utf8'),
        statusCode: 200,
    }
}

// Cannot use renderToString because it can lead to Minified React error #419.
// https://reactjs.org/docs/error-decoder.html/?invariant=419
async function renderImpl(children: ReactNode, options: RenderToPipeableStreamOptions = {}): Promise<Buffer> {
    return new Promise((resolve, onError) => {
        const { pipe } = renderToPipeableStream(children, {
            ...options,
            onAllReady() {
                const pt = new PassThrough()
                getRawBody(pt).then(resolve).catch(onError)
                pipe(pt)
            },
            onError,
        })
    })
}
