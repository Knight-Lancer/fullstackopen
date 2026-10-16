const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const frontend = path.resolve(__dirname, '../../phonebook')
const backend = path.resolve(__dirname, '..')
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
execFileSync(npm, ['install'], { cwd: frontend, stdio: 'inherit', shell: process.platform === 'win32' })
execFileSync(npm, ['run', 'build'], { cwd: frontend, stdio: 'inherit', shell: process.platform === 'win32' })
fs.rmSync(path.join(backend, 'dist'), { recursive: true, force: true })
fs.cpSync(path.join(frontend, 'dist'), path.join(backend, 'dist'), { recursive: true })
console.log('Frontend production build copied to backend/dist')
