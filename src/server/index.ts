import 'source-map-support/register'
import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda'
import { RespondInternalServerError, RespondNotFound } from './statuses'
import { matchRoutes } from 'react-router-dom'
import render from './render'
import { webappRoutes } from '../pages'

export async function handler(
    event: APIGatewayProxyEventV2,
    context: Context
): Promise<APIGatewayProxyStructuredResultV2> {
    console.log(`Event: ${JSON.stringify(event)}`)
    console.log(`Context: ${JSON.stringify(context)}`)

    try {
        const response = await impl(event)

        console.log(
            `Response: ${JSON.stringify({
                ...response,
                body: !response.body || response.body.length > 100 ? '...' : response.body,
            })}`
        )

        return response
    } catch (error) {
        // @ts-ignore
        console.trace(error)
        return RespondInternalServerError()
    }
}

async function impl(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> {
    // TODO do routing here.
    const routes = matchRoutes(webappRoutes, event.rawPath)
    if (routes == null || routes.length === 0 || routes.find(({ route }) => route.path === '*')) {
        console.log(event.rawPath, routes)
        return RespondNotFound()
    }

    return render(event)
}
