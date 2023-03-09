import { createContext } from 'react'

export type Session = {}

/*
 * This is how data is passed from server into client components. Everything in here must be JSON.stringify-able.
 */
export type PageContextData = {
    session?: Session
}

export const PageContext = createContext<PageContextData>({})
