import { useState, useEffect, useCallback } from 'react'
import Icon from '../../components/Icon'
import SkillChip from '../../components/SkillChip'
import experience from '../../../data/experience'

function ImageModal({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  const img = images[idx]
  const multi = images.length > 1

  return (
    <div className="img-modal-backdrop" onClick={onClose}>
      <div className="img-modal" onClick={e => e.stopPropagation()}>
        <div className="img-modal__stage">
          <button className="img-modal__close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={15} />
          </button>

          {multi && (
            <button className="img-modal__nav img-modal__nav--prev" onClick={prev} aria-label="Previous image">
              <Icon name="chevL" size={18} />
            </button>
          )}

          <img src={img.src} alt={img.alt} />

          {multi && (
            <button className="img-modal__nav img-modal__nav--next" onClick={next} aria-label="Next image">
              <Icon name="chevR" size={18} />
            </button>
          )}
        </div>

        <div className="img-modal__footer">
          <span className="img-modal__label">{img.alt}</span>
          {multi && (
            <div className="img-modal__dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`img-modal__dot${i === idx ? ' is-active' : ''}`}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ExperienceCard({ job, isLast, onImageClick }) {
  return (
    <article className="job" id={`job-${job.id}`}>
      <div className="job__rail">
        <span className="job__dot" />
        {!isLast && <span className="job__line" />}
      </div>

      <div className="job__body">
        <header className="job__head">
          <div className="job__title-row">
            <h3 className="job__company">
              <a href={job.url} target="_blank" rel="noreferrer">
                {job.company}
                <Icon name="external" size={14} />
              </a>
            </h3>
            <span className="job__period">{job.period}</span>
          </div>
          <div className="job__sub">
            <span className="job__role">{job.title}</span>
            <span className="job__sep">·</span>
            <span>{job.location}</span>
          </div>
        </header>

        <ul className="job__bullets">
          {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>

        <div className="job__stack">
          {job.stack.map(s => <SkillChip key={s} name={s} />)}
        </div>

        {job.images && job.images.length > 0 && (
          <div className="job__gallery">
            {job.images.map((img, i) => (
              <button
                key={i}
                className="job__thumb"
                onClick={() => onImageClick(job.images, i)}
                aria-label={`View ${img.alt}`}
              >
                <img src={img.src} alt={img.alt} loading="lazy" />
                <span className="job__thumb-label">{img.alt}</span>
                <span className="job__thumb-zoom" aria-hidden="true">
                  <Icon name="expand" size={13} />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

function Experience() {
  const [modal, setModal] = useState(null)

  const openModal = useCallback((images, index) => setModal({ images, index }), [])
  const closeModal = useCallback(() => setModal(null), [])

  return (
    <section className="page">
      <header className="page__head">
        <h1 className="page__title">Experience</h1>
        <p className="page__lede">Where I've shipped, what I shipped, and the stack I shipped it with.</p>
      </header>
      <div className="jobs">
        {experience.map((job, i) => (
          <ExperienceCard
            key={job.id}
            job={job}
            isLast={i === experience.length - 1}
            onImageClick={openModal}
          />
        ))}
      </div>
      {modal && (
        <ImageModal
          images={modal.images}
          startIndex={modal.index}
          onClose={closeModal}
        />
      )}
    </section>
  )
}

export default Experience
