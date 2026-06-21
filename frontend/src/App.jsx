import { useState } from 'react'
import IssueCard from './components/IssueCard'
import { SAMPLES } from './data/samples'

const API_URL = import.meta.env.VITE_API_URL

export default function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${API_URL}/check-compliance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Server error')
      }
      setResult(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function loadSample(type) {
    setText(SAMPLES[type])
    setResult(null)
    setError(null)
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">Rx</span>
            <span className="logo-text">Pharma<strong>Check</strong></span>
          </div>
          <p className="tagline">ABPI Code of Practice Compliance Analyser</p>
        </div>
      </header>

      <main className="main">
        <section className="input-section">
          <div className="section-header">
            <h2>Marketing Text</h2>
            <div className="sample-buttons">
              <span className="sample-label">Samples:</span>
              <button type="button" className="btn-sample btn-sample-bad" onClick={() => loadSample('bad')}>Non-compliant</button>
              <button type="button" className="btn-sample btn-sample-medium" onClick={() => loadSample('medium')}>Borderline</button>
              <button type="button" className="btn-sample btn-sample-good" onClick={() => loadSample('good')}>Compliant</button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              className="textarea"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste pharmaceutical marketing copy here…"
              rows={8}
            />
            <div className="form-footer">
              <span className="char-count">{text.length} / 10,000 characters</span>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !text.trim()}
              >
                {loading ? 'Analysing…' : 'Check Compliance'}
              </button>
            </div>
          </form>
        </section>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Analysing against ABPI Code of Practice…</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <section className="results-section">
            <div className={`verdict ${result.is_compliant ? 'verdict-pass' : 'verdict-fail'}`}>
              <span className="verdict-icon">{result.is_compliant ? '✓' : '✗'}</span>
              <div>
                <div className="verdict-label">
                  {result.is_compliant ? 'Compliant' : 'Non-Compliant'}
                </div>
                <p className="verdict-summary">{result.overall_summary}</p>
              </div>
            </div>

            {result.issues.length > 0 && (
              <>
                <h3 className="issues-heading">
                  {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''} found
                </h3>
                <div className="issues-list">
                  {result.issues.map((issue, i) => (
                    <IssueCard key={i} issue={issue} />
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          <strong>Disclaimer:</strong> This tool is a portfolio demonstration project for
          illustrative purposes only. It is not a substitute for qualified Medical, Legal,
          and Regulatory (MLR) review. Do not use for actual compliance decisions.
        </p>
        <p className="footer-sub">Powered by Claude AI · Built with LangChain + FastAPI</p>
      </footer>
    </div>
  )
}
