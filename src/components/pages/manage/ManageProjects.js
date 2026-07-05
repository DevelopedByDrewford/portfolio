import { useState, useEffect } from 'react'
import {
  collection, doc, addDoc, deleteDoc, setDoc, onSnapshot, query, orderBy,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../../firebase'
import staticProjects from '../../../data/projects'

const PROJECTS_COL = collection(db, 'projects')

const BLANK_PROJECT = {
  name: 'New project', link: '', github: '', tag: '', blurb: '',
  highlights: [], stack: [], img: '', video: '',
}

const splitList = (str) => str.split(',').map(s => s.trim()).filter(Boolean)

function ProjectRow({ project, isFirst, isLast, onMove, onDelete }) {
  const [form, setForm] = useState({
    name: project.name || '',
    link: project.link || '',
    github: project.github || '',
    tag: project.tag || '',
    blurb: project.blurb || '',
    highlights: (project.highlights || []).join(', '),
    stack: (project.stack || []).join(', '),
    img: project.img || '',
    video: project.video || '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState(null)

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      await setDoc(doc(db, 'projects', project.id), {
        name: form.name,
        link: form.link,
        github: form.github,
        tag: form.tag,
        blurb: form.blurb,
        highlights: splitList(form.highlights),
        stack: splitList(form.stack),
        img: form.img,
        video: form.video,
      }, { merge: true })
      setStatus('saved')
    } catch {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setStatus(null)
    try {
      const fileRef = ref(storage, `projects/${project.id}/${file.name}`)
      await uploadBytes(fileRef, file)
      const url = await getDownloadURL(fileRef)
      update('img', url)
      await setDoc(doc(db, 'projects', project.id), { img: url }, { merge: true })
    } catch {
      setStatus('error')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${form.name || 'this project'}"?`)) onDelete(project.id)
  }

  return (
    <form className="manage-project" onSubmit={handleSave}>
      <div className="manage-project__head">
        <div className="manage-project__thumb">
          {form.img
            ? <img src={form.img} alt="" />
            : <span className="manage-project__thumb-empty">{(form.name || '?').charAt(0).toUpperCase()}</span>}
        </div>
        <input
          className="manage-project__name"
          type="text"
          value={form.name}
          onChange={e => update('name', e.target.value)}
          placeholder="Project name"
        />
        <div className="manage-project__order">
          <button
            type="button"
            className="btn btn--quiet btn--sm"
            onClick={() => onMove(project.id, -1)}
            disabled={isFirst}
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            className="btn btn--quiet btn--sm"
            onClick={() => onMove(project.id, 1)}
            disabled={isLast}
            aria-label="Move down"
          >
            ↓
          </button>
        </div>
      </div>

      <div className="manage-form__row">
        <label className="login__field">
          <span>Live link</span>
          <input type="url" value={form.link} onChange={e => update('link', e.target.value)} />
        </label>
        <label className="login__field">
          <span>GitHub</span>
          <input type="url" value={form.github} onChange={e => update('github', e.target.value)} />
        </label>
        <label className="login__field">
          <span>Tag</span>
          <input
            type="text"
            value={form.tag}
            onChange={e => update('tag', e.target.value)}
            placeholder="Solo · Fullstack"
          />
        </label>
      </div>

      <label className="login__field">
        <span>Blurb</span>
        <textarea rows={3} value={form.blurb} onChange={e => update('blurb', e.target.value)} />
      </label>

      <label className="login__field">
        <span>Highlights (comma-separated)</span>
        <input type="text" value={form.highlights} onChange={e => update('highlights', e.target.value)} />
      </label>

      <label className="login__field">
        <span>Stack (comma-separated)</span>
        <input type="text" value={form.stack} onChange={e => update('stack', e.target.value)} />
      </label>

      <div className="manage-form__row">
        <label className="login__field">
          <span>Image URL</span>
          <input
            type="url"
            value={form.img}
            onChange={e => update('img', e.target.value)}
            placeholder="https://…"
          />
        </label>
        <label className="login__field">
          <span>Or upload image</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
        </label>
        <label className="login__field">
          <span>Video embed URL</span>
          <input
            type="url"
            value={form.video}
            onChange={e => update('video', e.target.value)}
            placeholder="https://www.youtube.com/embed/…"
          />
        </label>
      </div>
      {uploading && <span className="muted">Uploading…</span>}

      <div className="manage-form__ft">
        {status === 'saved' && <span className="manage-form__status is-ok">Saved.</span>}
        {status === 'error' && <span className="manage-form__status is-error">Something went wrong.</span>}
        <button type="button" className="btn btn--quiet btn--sm" onClick={handleDelete}>Delete</button>
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

function ManageProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    const q = query(PROJECTS_COL, orderBy('order'))
    return onSnapshot(
      q,
      snap => {
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      err => {
        setLoadError(err.message)
        setLoading(false)
      }
    )
  }, [])

  const handleAdd = async () => {
    const maxOrder = projects.reduce((max, p) => Math.max(max, p.order ?? 0), 0)
    await addDoc(PROJECTS_COL, { ...BLANK_PROJECT, order: maxOrder + 1 })
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'projects', id))
  }

  const handleMove = async (id, direction) => {
    const idx = projects.findIndex(p => p.id === id)
    const swapIdx = idx + direction
    if (swapIdx < 0 || swapIdx >= projects.length) return
    const a = projects[idx]
    const b = projects[swapIdx]
    await Promise.all([
      setDoc(doc(db, 'projects', a.id), { order: b.order ?? swapIdx }, { merge: true }),
      setDoc(doc(db, 'projects', b.id), { order: a.order ?? idx }, { merge: true }),
    ])
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      await Promise.all(staticProjects.map((p, i) => addDoc(PROJECTS_COL, {
        name: p.name || '',
        link: p.link || '',
        github: p.github || '',
        tag: p.tag || '',
        blurb: p.blurb || '',
        highlights: p.highlights || [],
        stack: p.stack || [],
        img: p.img || '',
        video: p.video || '',
        order: i,
      })))
    } finally {
      setSeeding(false)
    }
  }

  if (loading) {
    return <div className="block"><p className="muted">Loading…</p></div>
  }

  if (loadError) {
    return <div className="block"><p className="login__error">Couldn't load projects: {loadError}</p></div>
  }

  return (
    <div className="block manage-projects">
      <header className="block__head">
        <h2 className="h2">Projects</h2>
        <span className="muted">Manage the Projects page content.</span>
      </header>

      {projects.length === 0 && (
        <div className="manage-seed">
          <p className="muted">
            No projects in the database yet — the public page is showing the built-in list.
            Seed it here to start editing.
          </p>
          <button type="button" className="btn btn--primary" onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Seeding…' : `Seed ${staticProjects.length} projects from existing data`}
          </button>
        </div>
      )}

      {projects.map((p, i) => (
        <ProjectRow
          key={p.id}
          project={p}
          isFirst={i === 0}
          isLast={i === projects.length - 1}
          onMove={handleMove}
          onDelete={handleDelete}
        />
      ))}

      <button type="button" className="btn btn--ghost" onClick={handleAdd}>
        + Add project
      </button>
    </div>
  )
}

export default ManageProjects
