import { useImperativeHandle, useState } from 'react'
const Togglable = ({ buttonLabel, children, ref }) => {
  const [visible, setVisible] = useState(false)
  useImperativeHandle(ref, () => ({ hide: () => setVisible(false), toggleVisibility: () => setVisible(v => !v) }), [])
  return <div className="togglable">
    <div style={{ display: visible ? 'none' : '' }}><button onClick={() => setVisible(true)}>{buttonLabel}</button></div>
    <div style={{ display: visible ? '' : 'none' }}>{children}<button type="button" className="secondary" onClick={() => setVisible(false)}>cancel</button></div>
  </div>
}
export default Togglable
