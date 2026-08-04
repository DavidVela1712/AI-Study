import SectionHeader from '../components/SectionHeader'

function SettingsPage() {
  return (
    <div className="settings-page">
      <div className="card" style={{ padding: '1.75rem' }}>
        <SectionHeader
          title="Configuración"
          description="Ajustes y opciones de tu plataforma de estudio."
        />
        <div style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          <p>Próximamente podrás personalizar tu experiencia, ajustar notificaciones y gestionar tu cuenta.</p>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
