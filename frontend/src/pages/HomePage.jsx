import { useEffect, useState } from 'react'
import UserList from '../components/UserList'
import { getUsers } from '../services/userService'

function HomePage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setError('No se pudo conectar con el backend.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p>Cargando...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <section>
      <h2>Usuarios</h2>
      <UserList users={users} />
    </section>
  )
}

export default HomePage
