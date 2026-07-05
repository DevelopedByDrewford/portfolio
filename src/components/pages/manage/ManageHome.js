import { useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../../firebase'
import { HOME_CONTENT_DEFAULTS } from '../../../data/homeContent'

const HOME_DOC = doc(db, 'content', 'home')

function ManageHome() {
  const [form, setForm] = useState(HOME_CONTENT_DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    return onSnapshot(
      HOME_DOC,
      snap => {
        if (snap.exists()) setForm({ ...HOME_CONTENT_DEFAULTS, ...snap.data() })
        setLoading(false)
      },
      err => {
        setLoadError(err.message)
        setLoading(false)
      }
    )
  }, [])

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }))
  const updateWorking = (key, value) => setForm(f => ({ ...f, working: { ...f.working, [key]: value } }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      await setDoc(HOME_DOC, form, { merge: true })
      setStatus('saved')
    } catch {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setStatus(null)
    try {
      const fileRef = ref(storage, 'resume/AndrewCookResume.pdf')
      await uploadBytes(fileRef, file)
      update('resumeUrl', await getDownloadURL(fileRef))
    } catch {
      setStatus('error')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (loading) {
    return <div className="block"><p className="muted">Loading…</p></div>
  }

  if (loadError) {
    return <div className="block"><p className="login__error">Couldn't load content: {loadError}</p></div>
  }

  return (
    <form className="block manage-form" onSubmit={handleSave}>
      <header className="block__head">
        <h2 className="h2">Home</h2>
        <span className="muted">Manage the Home page content.</span>
      </header>

      <label className="login__field">
        <span>Hero lede</span>
        <textarea
          rows={3}
          value={form.heroLede}
          onChange={e => update('heroLede', e.target.value)}
        />
      </label>

      <label className="login__field">
        <span>Résumé (PDF)</span>
        <input type="file" accept="application/pdf" onChange={handleResumeUpload} disabled={uploading} />
        {uploading && <span className="muted">Uploading…</span>}
        {!uploading && form.resumeUrl && (
          <a className="manage-form__link" href={form.resumeUrl} target="_blank" rel="noreferrer">
            View current résumé
          </a>
        )}
      </label>

      <div className="manage-form__row">
        <label className="login__field">
          <span>Working — title</span>
          <input
            type="text"
            value={form.working.title}
            onChange={e => updateWorking('title', e.target.value)}
          />
        </label>
        <label className="login__field">
          <span>Working — company</span>
          <input
            type="text"
            value={form.working.label}
            onChange={e => updateWorking('label', e.target.value)}
          />
        </label>
        <label className="login__field">
          <span>Working — link</span>
          <input
            type="url"
            value={form.working.link}
            onChange={e => updateWorking('link', e.target.value)}
          />
        </label>
      </div>

      <label className="login__field">
        <span>Reading</span>
        <input type="text" value={form.reading} onChange={e => update('reading', e.target.value)} />
      </label>

      <label className="login__field">
        <span>Watching</span>
        <input type="text" value={form.watching} onChange={e => update('watching', e.target.value)} />
      </label>

      <label className="login__field">
        <span>Listening</span>
        <input type="text" value={form.listening} onChange={e => update('listening', e.target.value)} />
      </label>

      <div className="manage-form__ft">
        {status === 'saved' && <span className="manage-form__status is-ok">Saved.</span>}
        {status === 'error' && <span className="manage-form__status is-error">Something went wrong.</span>}
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default ManageHome
