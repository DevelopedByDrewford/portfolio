import { NavLink, Outlet } from 'react-router-dom'
import AuthGate from '../../../app/AuthGate'

const tabs = [
  { label: 'Overview',   path: '/manage',            end: true },
  { label: 'Home',       path: '/manage/home'                  },
  { label: 'Experience', path: '/manage/experience'             },
  { label: 'Projects',   path: '/manage/projects'               },
  { label: 'Interests',  path: '/manage/interests'               },
]

function Manage() {
  return (
    <AuthGate>
      <section className="page">
        <header className="hero">
          <div className="hero__eyebrow">
            <span className="hero__dot" />
            Internal
          </div>
          <h1 className="hero__title">Manage</h1>
          <p className="hero__lede">
            A quiet control room, reachable only via the command palette (⌘K / Ctrl+K).
          </p>
        </header>

        <nav className="manage-tabs" aria-label="Manage sections">
          {tabs.map(t => (
            <NavLink
              key={t.path}
              to={t.path}
              end={t.end}
              className={({ isActive }) => 'manage-tabs__item' + (isActive ? ' is-active' : '')}
            >
              {t.label}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </section>
    </AuthGate>
  )
}

export default Manage
