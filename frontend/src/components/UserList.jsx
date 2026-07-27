function UserList({ users }) {
  if (users.length === 0) {
    return <p>No hay usuarios registrados.</p>
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.idUser}>
          {user.name} — {user.email}
        </li>
      ))}
    </ul>
  )
}

export default UserList
