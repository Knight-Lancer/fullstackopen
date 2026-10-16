import { useState } from 'react'
const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const submit = async event => { event.preventDefault(); const success = await onLogin({ username, password }); if (success) { setUsername(''); setPassword('') } }
  return <section className="panel form-panel"><h2>Log in to application</h2><form onSubmit={submit}>
    <label>username<input name="username" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required /></label>
    <label>password<input name="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
    <button type="submit">login</button>
  </form></section>
}
export default LoginForm
