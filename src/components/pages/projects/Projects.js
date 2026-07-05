import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import Icon from '../../components/Icon'
import SkillChip from '../../components/SkillChip'
import staticProjects from '../../../data/projects'
import { db } from '../../../firebase'

function useProjects() {
  const [liveProjects, setLiveProjects] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order'))
    return onSnapshot(q, snap => {
      setLiveProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [])

  return liveProjects && liveProjects.length > 0 ? liveProjects : staticProjects
}

function ProjectCard({ proj }) {
  return (
    <article className="proj">
      <div className="proj__media">
        {proj.video ? (
          <div className="proj__video">
            <iframe
              src={proj.video}
              title={proj.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : (
          <img src={proj.img} alt={proj.name} loading="lazy" />
        )}
      </div>
      <div className="proj__body">
        <div className="proj__tag">{proj.tag}</div>
        <h3 className="proj__title">
          <a href={proj.link} target="_blank" rel="noreferrer">
            {proj.name}
            <Icon name="external" size={14} />
          </a>
        </h3>
        <p className="proj__blurb">{proj.blurb}</p>

        <ul className="proj__highlights">
          {proj.highlights.map((h, i) => (
            <li key={i}>
              <Icon name="dot" size={10} /> {h}
            </li>
          ))}
        </ul>

        <div className="proj__stack">
          {proj.stack.map(s => <SkillChip key={s} name={s} />)}
        </div>

        <div className="proj__cta">
          <a className="btn btn--ghost btn--sm" href={proj.link} target="_blank" rel="noreferrer">
            Live site <Icon name="arrow" size={14} />
          </a>
          <a className="btn btn--quiet btn--sm" href={proj.github} target="_blank" rel="noreferrer">
            <Icon name="github" size={14} /> GitHub
          </a>
        </div>
      </div>
    </article>
  )
}

function Projects() {
  const projects = useProjects()

  return (
    <section className="page">
      <header className="page__head">
        <h1 className="page__title">Projects</h1>
        <p className="page__lede">Solo builds, group sprints, and a few stories I wanted to tell in code.</p>
      </header>
      <div className="projects">
        {projects.map(p => <ProjectCard key={p.id} proj={p} />)}
      </div>
    </section>
  )
}

export default Projects
