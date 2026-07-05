import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import Icon from '../../components/Icon'
import staticInterests from '../../../data/interests'
import { db } from '../../../firebase'

function useInterests() {
  const [state, setState] = useState({ loading: true, liveInterests: null })

  useEffect(() => {
    const q = query(collection(db, 'interests'), orderBy('order'))
    return onSnapshot(
      q,
      snap => setState({ loading: false, liveInterests: snap.docs.map(d => ({ id: d.id, ...d.data() })) }),
      () => setState({ loading: false, liveInterests: null })
    )
  }, [])

  const { loading, liveInterests } = state
  return { loading, interests: liveInterests && liveInterests.length > 0 ? liveInterests : staticInterests }
}

function InterestCardSkeleton() {
  return (
    <div className="interest" aria-hidden="true">
      <div className="interest__media skel" />
      <div className="interest-skel__body">
        <div className="skel interest-skel__title" />
        <div className="skel interest-skel__line interest-skel__line--full" />
        <div className="skel interest-skel__line interest-skel__line--lg" />
        <div className="skel interest-skel__line interest-skel__line--md" />
        <div className="skel interest-skel__link" />
      </div>
    </div>
  )
}

/* ── Modal ─────────────────────────────────────────────────────────────── */
function InterestModal({ item, onClose }) {
  // Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return createPortal(
    <div className="interest-modal-backdrop" onClick={onClose}>
      <div className="interest-modal" onClick={e => e.stopPropagation()}>
        <button
          className="interest-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="close" size={16} />
        </button>

        <div className="interest-modal__media">
          <img src={item.img} alt={item.name} />
        </div>

        <div className="interest-modal__body">
          <h2 className="interest-modal__title">{item.name}</h2>
          <p className="interest-modal__desc">{item.description}</p>
          <a
            className="interest__link"
            href={item.link}
            target="_blank"
            rel="noreferrer"
          >
            {item.linkText} <Icon name="arrow" size={14} />
          </a>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ── Card ──────────────────────────────────────────────────────────────── */
function InterestCard({ item, onReadMore }) {
  const descRef = useRef(null)
  const [isClamped, setIsClamped] = useState(false)

  // Detect whether the CSS line-clamp is actually cutting off text.
  // ResizeObserver re-checks when the column width changes (e.g. breakpoint shift).
  useEffect(() => {
    const el = descRef.current
    if (!el) return
    const check = () => setIsClamped(el.scrollHeight > el.clientHeight)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <article className="interest">
      <div className="interest__media">
        <img src={item.img} alt={item.name} loading="lazy" />
      </div>
      <div className="interest__body">
        <h3 className="interest__title">{item.name}</h3>
        <p className="interest__desc" ref={descRef}>{item.description}</p>
        {isClamped && (
          <button
            className="interest__read-more"
            onClick={() => onReadMore(item)}
          >
            Read more
          </button>
        )}
        <a
          className="interest__link"
          href={item.link}
          target="_blank"
          rel="noreferrer"
        >
          {item.linkText} <Icon name="arrow" size={14} />
        </a>
      </div>
    </article>
  )
}

/* ── Page ──────────────────────────────────────────────────────────────── */
function Interests() {
  const { loading, interests } = useInterests()
  const [modalItem, setModalItem] = useState(null)
  const closeModal = useCallback(() => setModalItem(null), [])

  return (
    <section className="page">
      <header className="page__head">
        <h1 className="page__title">Interests</h1>
        <p className="page__lede">Outside of coding — the things that recharge me and shape how I think about craft.</p>
      </header>

      <div className="interests">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <InterestCardSkeleton key={i} />)
          : interests.map(item => (
            <InterestCard key={item.id} item={item} onReadMore={setModalItem} />
          ))}
      </div>

      {modalItem && <InterestModal item={modalItem} onClose={closeModal} />}
    </section>
  )
}

export default Interests
