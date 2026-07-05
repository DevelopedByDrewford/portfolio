import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/components/Icon'

const DESTINATIONS = [
  { id: 'home',       label: 'Home',       path: '/'           },
  { id: 'experience', label: 'Experience', path: '/experience' },
  { id: 'projects',   label: 'Projects',   path: '/projects'   },
  { id: 'interests',  label: 'Interests',  path: '/interests'  },
  { id: 'manage',     label: 'Manage',     path: '/manage', requireExact: true },
]

function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setActiveIndex(0)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DESTINATIONS.filter(d => {
      if (d.requireExact) return q === d.label.toLowerCase()
      return !q || d.label.toLowerCase().includes(q)
    })
  }, [query])

  const go = useCallback((path) => {
    navigate(path)
    close()
  }, [navigate, close])

  // Global toggle shortcut — cmd+k (mac) / ctrl+k (others)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Focus input + reset selection when opened
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0)
      const t = setTimeout(() => inputRef.current?.focus(), 0)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const onInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = results[activeIndex]
      if (item) go(item.path)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="cmdk-backdrop" onClick={close} role="presentation">
      <div
        className="cmdk"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
      >
        <div className="cmdk__input-wrap">
          <Icon name="search" size={16} />
          <input
            ref={inputRef}
            className="cmdk__input"
            type="text"
            placeholder="Where to?"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(0) }}
            onKeyDown={onInputKeyDown}
            aria-label="Search pages"
          />
          <kbd className="cmdk__esc">Esc</kbd>
        </div>

        <div className="cmdk__list" role="listbox">
          {results.length === 0 && (
            <div className="cmdk__empty">No matches</div>
          )}
          {results.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={i === activeIndex}
              className={'cmdk__item' + (i === activeIndex ? ' is-active' : '')}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => go(item.path)}
            >
              <span className="cmdk__item-label">{item.label}</span>
              <Icon name="chevR" size={14} />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CommandPalette
