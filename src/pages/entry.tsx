import React, { startTransition, StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { hydrateRoot } from 'react-dom/client'
import { PageContextData } from './context'
import Pages from './index'

/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

declare global {
    interface Window {
        context: PageContextData
    }
}

function hydrate() {
    startTransition(() => {
        hydrateRoot(
            document.getElementById('app')!,
            <BrowserRouter>
                <StrictMode>
                    <Pages context={window.context} />
                </StrictMode>
            </BrowserRouter>
        )
    })
}

typeof requestIdleCallback === 'function' ? requestIdleCallback(hydrate) : setTimeout(hydrate, 1)
