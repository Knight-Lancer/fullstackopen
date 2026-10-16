const mongoose = require('mongoose')

const [password, name, number] = process.argv.slice(2)
if (!password || (name && !number) || (!name && number)) {
  console.log('Usage: node mongo.js <password> [<name> <number>]')
  process.exit(1)
}
const template = process.env.MONGODB_URI_TEMPLATE
if (!template || !template.includes('<password>')) {
  console.error('Set MONGODB_URI_TEMPLATE with a <password> placeholder')
  process.exit(1)
}
process.env.MONGODB_URI = template.replace('<password>', encodeURIComponent(password))
const Person = require('./models/person')

async function main() {
  try {
    // mongoose.connect is started by the model module; queries wait for the connection.
    if (name && number) {
      await new Person({ name, number }).save()
      console.log(`added ${name} number ${number} to phonebook`)
    } else {
      const persons = await Person.find({})
      console.log('phonebook:')
      persons.forEach(person => console.log(`${person.name} ${person.number}`))
    }
  } catch (error) {
    console.error('MongoDB operation failed:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}
main()
