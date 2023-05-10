const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// var AWS = require("aws-sdk");
// AWS.config.update({
//   region: 'us-west-2',
//   accessKeyId: 'ASIAVAPHVQUMSBOMATF5',
//   secretAccessKey: 'T/sDgi51/Zpeq4yaQ9Q72np/WuzcfL5Bv6AvaiBr',
//   awsSessionToken: 'IQoJb3JpZ2luX2VjEGAaCmFwLXNvdXRoLTEiRjBEAiBm9581K6EsnghJPjx1BpYAmkn79wycjAjQ6fhADVIPBwIgMiWlkQ+wbjzSVB4e8VcuTCFOTtcWjF+ul0nGQr6HT2gqrAIIeRAAGgwzNDQ2MjAxMDcwMzMiDAjKbyVbCxefiiPpUCqJAnYQIasTn7+v/svh6ss01yJAFr4WQ4kwEJn/vol8R2VMW9W3bqap0gNkV/tMwtUZRjXObYaosfpVag4hk93Pcggpr6MKd3MPt6Vf44wMZJKoe68xHjFKs6zY3mBsXMjAySUWF7TMUUT1RZBkOFCLHGFyejwR4j7aKqBUIiKLCuueYSLZ833jEo3kHTX2ROhLy0LbsZhuPq4amNFqWreXQ4v1sjUdSuxHJF0XNDLbDIFLAexZw/po8X8pkyn7PMMXPOjBUxSMP9rMw9e6a4eF56a8xJk2xSMdvOL/k/hIjTS8WVxR4rLmL1kxPklDoa1sbeEyyR1Kdbl2eJjTsKHesRkSNvHwugoamQAwoN/pogY6ngE3RgtFS5Vxr37OfLxm0V9SaL9524LRPOTbOOYFwXKihMpasWcmPZSV17edD+zbR8zBzfA4+yxWlcOxY4G1ZbunpxIQ0yI7odOYfHKICeBMWQTZ/K4jCWB9k4+F0ljdYHY1vLEV5bIJk3J8sfJO3yY2jOvlB76TcJBqn5D4bhrCf5B6GfNcZ7uJ8wK7jeIR27k60B0bSckMwS4itcYVZw=='
// });
// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))
// #############################################################################

// Create or Update an item
app.post('/:col/:key', async (req, res) => {
  console.log(req.body)

  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).set(key, req.body)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Delete an item
app.delete('/:col/:key', async (req, res) => {
  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).delete(key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a single item
app.get('/:col/:key', async (req, res) => {
  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} get key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).get(key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a full listing
app.get('/:col', async (req, res) => {
  const col = req.params.col
  console.log(`list collection: ${col} with params: ${JSON.stringify(req.params)}`)
  const items = await db.collection(col).list()
  console.log(JSON.stringify(items, null, 2))
  res.json(items).end()
})

// Catch all handler for all other request.
app.use('*', (req, res) => {
  res.json({ msg: 'no route handler found' }).end()
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
