import { NavLink, useLocation } from 'react-router-dom'
import Icon from '../components/components/Icon'
import Spotify from '../components/components/Spotify'
import iconArray from '../data/social'

const nav = [
  { id: 1, label: 'Home',       path: '/'           },
  { id: 2, label: 'Experience', path: '/experience' },
  { id: 3, label: 'Projects',   path: '/projects'   },
  { id: 4, label: 'Interests',  path: '/interests'  },
]

function NavItem({ item, onClose }) {
  const location = useLocation()
  const isActive = item.path === '/'
    ? location.pathname === '/'
    : location.pathname.startsWith(item.path)

  return (
    <NavLink
      to={item.path}
      className={'nav__item' + (isActive ? ' is-active' : '')}
      onClick={onClose}
    >
      <span className="nav__indicator" aria-hidden="true" />
      <span className="nav__label">{item.label}</span>
      {isActive && (
        <span className="nav__chev">
          <Icon name="chevR" size={14} />
        </span>
      )}
    </NavLink>
  )
}

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Tap-outside backdrop (mobile only) */}
      <div
        className={'sidebar-backdrop' + (isOpen ? ' is-visible' : '')}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={'sidebar' + (isOpen ? ' is-open' : '')}>
        <div className="sidebar__inner">

          {/* Close button — visible on mobile only */}
          <button className="sidebar__close" onClick={onClose} aria-label="Close menu">
            <Icon name="close" size={18} />
          </button>

          {/* Avatar + name + role */}
          <div className="profile">
            <NavLink to="/" className="profile__avatar" aria-label="Home" onClick={onClose}>
              <img src="https://i.imgur.com/T09m2sD.png" alt="Andrew Cook" />
            </NavLink>
            <div className="profile__meta">
              <div className="profile__name">
                <span className="signature signature--script">DEVELOPED BY DREWFORD</span>
              </div>
              <div className="profile__role">Software Engineer</div>
              <div className="profile__location">
                <Icon name="pin" size={12} /> Houston, TX
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="nav" aria-label="Primary">
            {nav.map(item => (
              <NavItem key={item.id} item={item} onClose={onClose} />
            ))}
          </nav>

          {/* Socials */}
          <div className="socials" aria-label="Social links">
            {iconArray.map(s => (
              <a
                key={s.id}
                className="socials__link"
                href={s.url}
                target="_blank"
                rel="noreferrer"
                title={s.name}
              >
                <Icon name={s.icon} size={16} />
              </a>
            ))}
          </div>

          {/* Spotify */}
          <Spotify />

          <div className="sidebar__foot">
            <span>© 2026 Andrew Cook</span>
            <a href="https://drewford.dev" target="_blank" rel="noreferrer">
              drewford.dev
            </a>
          </div>

        </div>
      </aside>
    </>
  )
}

export default Sidebar
