import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null
const setToken = newToken => { token = newToken ? `Bearer ${newToken}` : null }
const auth = () => ({ headers: { Authorization: token } })
const getAll = async () => (await axios.get(baseUrl)).data
const create = async blog => (await axios.post(baseUrl, blog, auth())).data
const update = async (id, blog) => (await axios.put(`${baseUrl}/${id}`, blog, auth())).data
const remove = async id => (await axios.delete(`${baseUrl}/${id}`, auth())).data
export default { setToken, getAll, create, update, remove }
