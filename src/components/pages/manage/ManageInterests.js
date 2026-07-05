import { useState, useEffect } from 'react'
import {
  collection, doc, addDoc, deleteDoc, setDoc, onSnapshot, query, orderBy,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../../firebase'
import staticInterests from '../../../data/interests'

const INTERESTS_COL = collection(db, 'interests')

const BLANK_INTEREST = {
  name: 'New interest', link: '', linkText: '', description: '', img: '',
}

function InterestRow({ interest, isFirst, isLast, onMove, onDelete }) {
  const [form, setForm] = useState({
    name: interest.name || '',
    link: interest.link || '',
    linkText: interest.linkText || '',
    description: interest.description || '',
    img: interest.img || '',
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
      await setDoc(doc(db, 'interests', interest.id), {
        name: form.name,
        link: form.link,
        linkText: form.linkText,
        description: form.description,
        img: form.img,
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
      const fileRef = ref(storage, `interests/${interest.id}/${file.name}`)
      await uploadBytes(fileRef, file)
      const url = await getDownloadURL(fileRef)
      update('img', url)
      await setDoc(doc(db, 'interests', interest.id), { img: url }, { merge: true })
    } catch {
      setStatus('error')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${form.name || 'this interest'}"?`)) onDelete(interest.id)
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
          placeholder="Interest name"
        />
        <div className="manage-project__order">
          <button
            type="button"
            className="btn btn--quiet btn--sm"
            onClick={() => onMove(interest.id, -1)}
            disabled={isFirst}
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            className="btn btn--quiet btn--sm"
            onClick={() => onMove(interest.id, 1)}
            disabled={isLast}
            aria-label="Move down"
          >
            ↓
          </button>
        </div>
      </div>

      <div className="manage-form__row">
        <label className="login__field">
          <span>Link</span>
          <input type="url" value={form.link} onChange={e => update('link', e.target.value)} />
        </label>
        <label className="login__field">
          <span>Link text</span>
          <input
            type="text"
            value={form.linkText}
            onChange={e => update('linkText', e.target.value)}
            placeholder="Follow me on…"
          />
        </label>
        <label className="login__field">
          <span>Image URL</span>
          <input
            type="url"
            value={form.img}
            onChange={e => update('img', e.target.value)}
            placeholder="https://…"
          />
        </label>
      </div>

      <label className="login__field">
        <span>Description</span>
        <textarea rows={4} value={form.description} onChange={e => update('description', e.target.value)} />
      </label>

      <label className="login__field">
        <span>Or upload image</span>
        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
        {uploading && <span className="muted">Uploading…</span>}
      </label>

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

function ManageInterests() {
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    const q = query(INTERESTS_COL, orderBy('order'))
    return onSnapshot(
      q,
      snap => {
        setInterests(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      err => {
        setLoadError(err.message)
        setLoading(false)
      }
    )
  }, [])

  const handleAdd = async () => {
    const maxOrder = interests.reduce((max, i) => Math.max(max, i.order ?? 0), 0)
    await addDoc(INTERESTS_COL, { ...BLANK_INTEREST, order: maxOrder + 1 })
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'interests', id))
  }

  const handleMove = async (id, direction) => {
    const idx = interests.findIndex(i => i.id === id)
    const swapIdx = idx + direction
    if (swapIdx < 0 || swapIdx >= interests.length) return
    const a = interests[idx]
    const b = interests[swapIdx]
    await Promise.all([
      setDoc(doc(db, 'interests', a.id), { order: b.order ?? swapIdx }, { merge: true }),
      setDoc(doc(db, 'interests', b.id), { order: a.order ?? idx }, { merge: true }),
    ])
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      await Promise.all(staticInterests.map((i, idx) => addDoc(INTERESTS_COL, {
        name: i.name || '',
        link: i.link || '',
        linkText: i.linkText || '',
        description: i.description || '',
        img: i.img || '',
        order: idx,
      })))
    } finally {
      setSeeding(false)
    }
  }

  if (loading) {
    return <div className="block"><p className="muted">Loading…</p></div>
  }

  if (loadError) {
    return <div className="block"><p className="login__error">Couldn't load interests: {loadError}</p></div>
  }

  return (
    <div className="block manage-projects">
      <header className="block__head">
        <h2 className="h2">Interests</h2>
        <span className="muted">Manage the Interests page content.</span>
      </header>

      {interests.length === 0 && (
        <div className="manage-seed">
          <p className="muted">
            No interests in the database yet — the public page is showing the built-in list.
            Seed it here to start editing.
          </p>
          <button type="button" className="btn btn--primary" onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Seeding…' : `Seed ${staticInterests.length} interests from existing data`}
          </button>
        </div>
      )}

      {interests.map((item, i) => (
        <InterestRow
          key={item.id}
          interest={item}
          isFirst={i === 0}
          isLast={i === interests.length - 1}
          onMove={handleMove}
          onDelete={handleDelete}
        />
      ))}

      <button type="button" className="btn btn--ghost" onClick={handleAdd}>
        + Add interest
      </button>
    </div>
  )
}

export default ManageInterests
