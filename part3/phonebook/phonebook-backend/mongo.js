const mongoose = require('mongoose')
if (process.argv.length < 3) {
	console.log('Give password dumb ass')
	process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://willcrockett:${password}@cluster0.avyfmvl.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
console.log(url)

mongoose.connect(url)
console.log(2)

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4]
	})

	person.save().then(() => {
		console.log('Person saved')
		mongoose.connection.close()
	})
} else if (process.argv.length === 3) {
	Person.find({}).then(result => {
		result.forEach(person => console.log(person))
		mongoose.connection.close()
	})
}