const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
if (!url) {
  console.error('MONGODB_URI must be set in the environment')
  process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => console.log('Connected to MongoDB')).catch(error => {
  console.error('MongoDB connection failed:', error.message)
  process.exit(1)
})

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: value => /^\d{2,3}-\d+$/.test(value),
      message: props => `${props.value} is not a valid phone number`
    }
  }
})

personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
