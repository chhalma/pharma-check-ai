const SEVERITY_STYLE = {
  HIGH:   { background: '#fff5f5', color: '#c53030', border: '#fc8181' },
  MEDIUM: { background: '#fffaf0', color: '#c05621', border: '#f6ad55' },
  LOW:    { background: '#fffff0', color: '#975a16', border: '#f6e05e' },
}

export default function IssueCard({ issue }) {
  const sev = SEVERITY_STYLE[issue.severity] || SEVERITY_STYLE.MEDIUM
  return (
    <div className="issue-card" style={{ borderLeftColor: sev.border }}>
      <div className="issue-card-header">
        <div className="issue-rule">{issue.rule_violated}</div>
        <div className="issue-badges">
          <span className="badge-clause">{issue.abpi_clause}</span>
          <span className="badge-severity" style={{ background: sev.background, color: sev.color }}>
            {issue.severity}
          </span>
        </div>
      </div>
      <div className="issue-excerpt">"{issue.excerpt}"</div>
      <p className="issue-explanation">{issue.explanation}</p>
      <div className="issue-fix">
        <span className="fix-label">Suggested fix</span>
        <p>{issue.suggested_fix}</p>
      </div>
    </div>
  )
}
