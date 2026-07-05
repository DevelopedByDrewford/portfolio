import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import Icon from '../../components/Icon'
import SkillChip from '../../components/SkillChip'
import skillGroups from '../../../data/skillGroups'
import { HOME_CONTENT_DEFAULTS } from '../../../data/homeContent'
import AndrewCookResume from '../../../data/AndrewCookResume.pdf'
import { db } from '../../../firebase'

function useHomeContent() {
  const [content, setContent] = useState(HOME_CONTENT_DEFAULTS)

  useEffect(() => {
    return onSnapshot(doc(db, 'content', 'home'), snap => {
      if (snap.exists()) {
        setContent({ ...HOME_CONTENT_DEFAULTS, ...snap.data() })
      }
    })
  }, [])

  return content
}

// Fonts to spin through before landing — all system-safe so no load delay
const CYCLE_FONTS = [
  '"Impact", sans-serif',
  '"Georgia", serif',
  '"Courier New", monospace',
  '"Arial Black", sans-serif',
  '"Times New Roman", serif',
  '"Trebuchet MS", sans-serif',
  '"Palatino Linotype", serif',
  '"Impact", sans-serif',
  '"Courier New", monospace',
  '"Georgia", serif',
  '"Trebuchet MS", sans-serif',
  '"Arial Black", sans-serif',
  '"Palatino Linotype", serif',
]

const FINAL_FONT = '"Julius One", Georgia, serif'

// Delays between each step in ms — fast at first, decelerating to a stop
const DELAYS = [110, 120, 130, 145, 165, 190, 225, 270, 330, 410, 520, 660, 820]

function useNameFontCycle() {
  const [font, setFont] = useState(FINAL_FONT)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let step = 0
    let timeout

    const tick = () => {
      if (step < CYCLE_FONTS.length) {
        setFont(CYCLE_FONTS[step])
        timeout = setTimeout(tick, DELAYS[step] ?? 100)
        step++
      } else {
        setFont(FINAL_FONT)
        setDone(true)
      }
    }

    // Short pause before the spin begins
    timeout = setTimeout(tick, 400)
    return () => clearTimeout(timeout)
  }, [])

  return { font, done }
}

function Home() {
  const navigate = useNavigate()
  const { font, done } = useNameFontCycle()
  const content = useHomeContent()

  return (
    <section className="page">

      {/* Hero */}
      <header className="hero">
        <div className="hero__eyebrow">
          <span className="hero__dot" />
          Available for new opportunities
        </div>
        <h1 className="hero__title">
          Hi, I'm{' '}
          <span
            className={'hero__name--script' + (done ? ' is-settled' : ' is-cycling')}
            style={{ fontFamily: font }}
          >
            Drew Cook
          </span>.<br />
          Software engineer.
        </h1>
        <p className="hero__lede">
          {content.heroLede}
        </p>
        <div className="hero__cta">
          {content.resumeUrl ? (
            <a className="btn btn--primary" href={content.resumeUrl} target="_blank" rel="noreferrer">
              <Icon name="download" size={16} /> Download résumé
            </a>
          ) : (
            <a className="btn btn--primary" href={AndrewCookResume} download>
              <Icon name="download" size={16} /> Download résumé
            </a>
          )}
          <button className="btn btn--ghost" onClick={() => navigate('/projects')}>
            See projects <Icon name="arrow" size={16} />
          </button>
        </div>
      </header>

      <hr className="rule" />

      {/* Skills */}
      <div className="block">
        <header className="block__head">
          <h2 className="h2">Skills</h2>
          <span className="muted">A working toolbox, not a laundry list.</span>
        </header>
        <div className="skills">
          {Object.entries(skillGroups).map(([group, names]) => (
            <div key={group} className="skills__group">
              <div className="skills__label">{group}</div>
              <div className="skills__chips">
                {names.map(n => <SkillChip key={n} name={n} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="rule" />

      {/* Currently */}
      <div className="block">
        <header className="block__head">
          <h2 className="h2">Currently</h2>
        </header>
        <div className="currently">
          <div className="currently__item">
            <div className="currently__k">Working</div>
            <div className="currently__v">
              {content.working.title} at{' '}
              <a href={content.working.link} target="_blank" rel="noreferrer">
                {content.working.label}
              </a>
            </div>
          </div>
          <div className="currently__item">
            <div className="currently__k">Reading</div>
            <div className="currently__v">{content.reading}</div>
          </div>
          <div className="currently__item">
            <div className="currently__k">Watching</div>
            <div className="currently__v">{content.watching}</div>
          </div>
          <div className="currently__item">
            <div className="currently__k">Listening</div>
            <div className="currently__v">{content.listening}</div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default Home
