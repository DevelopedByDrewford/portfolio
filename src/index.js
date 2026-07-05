import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './app/App.js'
import ErrorPage from './app/ErrorPage.js'

import Home from './components/pages/home/Home.js'
import Experience from './components/pages/experience/Experience.js'
import Projects from './components/pages/projects/Projects.js'
import Interests from './components/pages/interests/Interests.js'
import Manage from './components/pages/manage/Manage.js'
import ManageOverview from './components/pages/manage/ManageOverview.js'
import ManageHome from './components/pages/manage/ManageHome.js'
import ManageExperience from './components/pages/manage/ManageExperience.js'
import ManageProjects from './components/pages/manage/ManageProjects.js'
import ManageInterests from './components/pages/manage/ManageInterests.js'

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
            },
            {
                path: "manage",
                element: <Manage />,
                children: [
                    {
                        index: true,
                        element: <ManageOverview />
                    },
                    {
                        path: "home",
                        element: <ManageHome />
                    },
                    {
                        path: "experience",
                        element: <ManageExperience />
                    },
                    {
                        path: "projects",
                        element: <ManageProjects />
                    },
                    {
                        path: "interests",
                        element: <ManageInterests />
                    }
                ]
            }
        ]
    }
])

root.render(<RouterProvider router={router} />)