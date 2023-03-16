import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
//const promise = axios.get('http://localhost:3001/notes')
/**
 * Axios' get method returns a Promise object.
 * A promise object can have one of three states:
 * 1. Pending: final value (one of the other two) is not available yet
 * 2. Fulfilled/resolved: Operation is completed and final value is available. Generally means
 *      that the operation succeeded
 * 3. Rejected: An error has prevented the final value from being determined. Generally means
 *      that the operation failed.
 */
// To access the result of an operation represented by a promise, we have to register
// an event handler to the promise with method then:
// promise.then(response => {
//   console.log(response)
// })
// console.log(promise)
// no need to store promise in a variable. can just do:
// axios.get('http://localhost:3001/notes').then(response => {
//   console.log(response)
// })
// can format chained method calls in this more readoable way?
// axios
//   .get('http://localhost:3001/notes')
//   .then(response => {
//     const notes = response.data /** Access the retrieved data, the list of  ntoes
//      * Data is retrieved in plaintext format - just one long string, but since the server
//      * specified the data format in the content-type header, axios can parse the plaintext
//      * into a javascript array
//      */
//     console.log(notes)
//   })
// const promise2 = axios.get('http://localhost:3001/foobar') - fails because foobar doesnt exist
// console.log(promise2)
ReactDOM.createRoot(document.getElementById('root')).render(<App />)