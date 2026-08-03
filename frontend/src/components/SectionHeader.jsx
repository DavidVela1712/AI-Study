import './SectionHeader.css'

function SectionHeader({ title, description, action }) {
  return (
    <div className="section-header-row">
      <div>
        <p className="section-header-row__title">{title}</p>
        {description && <p className="section-header-row__description">{description}</p>}
      </div>

      {action && <div className="section-header-row__action">{action}</div>}
    </div>
  )
}

export default SectionHeader
