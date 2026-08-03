import './StatCard.css'

function StatCard({ icon: Icon, label, value, subtitle, accent }) {
  return (
    <div className={`stat-card ${accent ? 'stat-card--accent' : ''}`}>
      <div className="stat-card__icon">
        <Icon size={20} />
      </div>
      <div className="stat-card__content">
        <p className="stat-card__label">{label}</p>
        <h3 className="stat-card__value">{value}</h3>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}

export default StatCard
