import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'

export const RespondMovedPermanently = (location: string) =>
    ({
        statusCode: 301,
        body: 'Moved Permanently',
        headers: {
            'cache-control': 'max-age=86400, stale-while-revalidate',
            'content-type': 'text/plain',
            location,
        },
    } as APIGatewayProxyStructuredResultV2)

export const RespondFound = (location: string) =>
    ({
        statusCode: 302,
        body: 'Found',
        headers: {
            'cache-control': 'no-cache, no-store, must-revalidate',
            'content-type': 'text/plain',
            location,
        },
    } as APIGatewayProxyStructuredResultV2)

export const RespondBadRequest = () =>
    ({
        statusCode: 400,
        body: 'Bad Request',
        headers: {
            'cache-control': 'no-cache, no-store, must-revalidate',
            'content-type': 'text/plain',
        },
    } as APIGatewayProxyStructuredResultV2)

export const RespondNotFound = () =>
    ({
        statusCode: 404,
        body: 'Not Found',
        headers: {
            'cache-control': 'no-cache, no-store, must-revalidate',
            'content-type': 'text/plain',
        },
    } as APIGatewayProxyStructuredResultV2)

export const RespondInternalServerError = () =>
    ({
        statusCode: 500,
        body: 'Internal Server Error',
        headers: {
            'cache-control': 'no-cache, no-store, must-revalidate',
            'content-type': 'text/plain',
        },
    } as APIGatewayProxyStructuredResultV2)
