const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3 },
  name: String,
  passwordHash: { type: String, required: true },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})
userSchema.set('toJSON', { transform: (_doc, obj) => {
  obj.id = obj._id.toString()
  delete obj._id
  delete obj.__v
  delete obj.passwordHash
} })
module.exports = mongoose.model('User', userSchema)
