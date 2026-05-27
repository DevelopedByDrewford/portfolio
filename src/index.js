import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './app/App.js'
import ErrorPage from './app/ErrorPage.js'

import Home from './components/pages/home/Home.js'
import Experience from './components/pages/experience/Experience.js'
import Projects from './components/pages/projects/Projects.js'
import Interests from './components/pages/interests/Interests.js'

const appElement = document.getElementById('app')
const root = createRoot(appElement)

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "experience",
                element: <Experience />
            },
            {
                path: "projects",
                element: <Projects />
            },
            {
                path: "interests",
                element: <Interests />
            }
        ]
    }
])

root.render(<RouterProvider router={router} />)