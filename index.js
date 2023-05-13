const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Create or Update an item
app.post('/participants/:key', async (req, res) => {
  console.log(req.body)

  // const col = req.params.col
  const key = req.params.key
  // console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection('participants').set(key, req.body)
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
// app.get('/participants/:key', async (req, res) => {
//   // const col = req.params.col
//   const key = req.params.key
//   // console.log(`from collection: ${col} get key: ${key} with params ${JSON.stringify(req.params)}`)
//   const item = (await db.collection('participants').get(key))?.props
//   console.log(JSON.stringify(item, null, 2))
//   res.json(item).end()
// })

// Get a full listing
app.get('/participants', async (req, res) => {
  // const col = req.params.col
  // console.log(`list collection with params: ${JSON.stringify(req.params)}`)
  const filterCondition = {
    'attribute': 'props.active',
    'operator': '=',
    'value': true
  }
  const items = await db.collection('participants').filter(filterCondition)
  
  console.log(JSON.stringify(items))
  res.json(items).end()
})

// Get a full listing
app.get('/participants/details', async (req, res) => {
  // const col = req.params.col
  // console.log(`list collection with params: ${JSON.stringify(req.params)}`)
  const { results: itemsMetaData } = await db.collection('participants').list()
  const items = await Promise.all(
    itemsMetaData.map(async ({ key }) => (await db.collection('participants').get(key))?.props)
  );
  console.log(JSON.stringify(items))
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
