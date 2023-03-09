import 'src/styles/custom.scss'
import { createRoutesFromElements, Route, Routes } from 'react-router-dom'
import { PageContext, PageContextData } from './context'
import React, { Suspense } from 'react'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import SSRProvider from 'react-bootstrap/SSRProvider'
import styles from './index.module.scss'

function Home() {
    return (
        <Container fluid>
            <h1 className={styles.header}>Under construction! </h1>
            <svg className="bi" width="32" height="32" fill="currentColor">
                <use xlinkHref="images/bootstrap-icons.svg#heart-fill" />
            </svg>
            <svg className="bi" width="32" height="32" fill="currentColor">
                <use xlinkHref="images/bootstrap-icons.svg#toggles" />
            </svg>
            <svg className="bi" width="32" height="32" fill="currentColor">
                <use xlinkHref="images/bootstrap-icons.svg#shop" />
            </svg>
        </Container>
    )
}

function Fallback() {
    return (
        <Container fluid>
            Loading... <Spinner animation="border" />
        </Container>
    )
}

function NotFound() {
    return (
        <Container fluid>
            <Alert variant="danger">Page Not Found</Alert>
        </Container>
    )
}

const routes = [
    <Route
        key="home"
        index
        path="/"
        element={
            <Suspense fallback={<Fallback />}>
                <Home />
            </Suspense>
        }
    />,
    <Route key="404" path="*" element={<NotFound />} />,
]

export default function Pages({ context }: { context: PageContextData }) {
    return (
        <PageContext.Provider value={context}>
            <SSRProvider>
                <Routes>{routes}</Routes>
            </SSRProvider>
        </PageContext.Provider>
    )
}

export const webappRoutes = routes.map((r) => createRoutesFromElements(r)).reduce((a, b) => a.concat(b))
