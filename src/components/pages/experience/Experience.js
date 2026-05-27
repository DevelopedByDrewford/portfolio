import Icon from '../../components/Icon'
import SkillChip from '../../components/SkillChip'
import experience from '../../../data/experience'

function ExperienceCard({ job, isLast }) {
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
              <div key={i} className="job__thumb">
                <img src={img.src} alt={img.alt} loading="lazy" />
                <span className="job__thumb-label">{img.alt}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

function Experience() {
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
          />
        ))}
      </div>
    </section>
  )
}

export default Experience
