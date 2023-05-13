const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Create or Update an item
app.post('/participants/add', async (req, res) => {
  console.log(req.body)

  // const col = req.params.col
  const key = req.params.key
  const email = req.params.personal.email
  // console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
  const data = await db.collection('participants').set(email, req.body)
  console.log(JSON.stringify(data, null, 2))
  res.status(200).json({
    status: "success",
    data 
  }).end();
  // res.json(item).end()
})


// Get a full listing
app.get('/participants', async (req, res) => {
  const { results: data } = await db.collection('participants').filter()
  console.log(JSON.stringify(data))
  res.status(200).json({
    status: "success",
    data 
  }).end();
  // res.json(items).end()
})

// Get a full listing personal
app.get('/participants/details', async (req, res) => {
  const { results: items } = await db.collection('participants').filter()
  const data = items.filter(el => el.props.active == true).map(e => e.props.personal)
  console.log(JSON.stringify(data))
  res.status(200).json({
    status: "success",
    data 
  }).end();
  // res.json(filteredList).end()
})

// Get a full listing personal
app.get('/participants/details/deleted', async (req, res) => {
  const { results: items } = await db.collection('participants').filter()
  const data = items.filter(el => el.props.active == false).map(e => e.props.personal)
  console.log(JSON.stringify(data))
  res.status(200).json({
    status: "success",
    data 
  }).end();
  // res.json(filteredList).end()
})

// Get a single item
app.get('/participants/details/:email', async (req, res) => {
  const email = req.params.email
  const item = (await db.collection('participants').get(email))?.props
  if (item.active == false) {
    res.status(400).json({ status: "error", message: 'Deleted Participant' });

  }
  const data = { ...item.personal, active: item.active }
  console.log(JSON.stringify(data, null, 2))
  res.status(200).json({
    status: "success",
    data 
  }).end();
  // res.json(data).end()
})

// Get a single item work
app.get('/participants/work/:email', async (req, res) => {
  const email = req.params.email
  const item = (await db.collection('participants').get(email))?.props
  if (item.active == false) {
    res.status(400).json({ status: "error", message: 'Deleted Participant' });

  }
  const data = item.work;
  console.log(JSON.stringify(data, null, 2))
  res.status(200).json({
    status: "success",
    data 
  }).end();
  // res.json(data).end()
})
 
// Get a single item work
app.get('/participants/home/:email', async (req, res) => {
  const email = req.params.email
  const item = (await db.collection('participants').get(email))?.props
  if (item.active == false) {
    res.status(400).json({ status: "error", message: 'Deleted Participant' });

  }
  const data = item.home;
  console.log(JSON.stringify(data, null, 2))
  res.status(200).json({
    status: "success",
    data 
  }).end();
  // res.json(data).end()
})
 

// Delete an item
app.delete('/participants/:email', async (req, res) => {
  const email = req.params.email

  const item = (await db.collection('participants').get(email))
  const key = item.key
  const {work, home, personal} = item.props

  const result = await db.collection('participants').set(key, {personal, home, work, active: false})
  console.log(JSON.stringify(result, null, 2))
  res.json(result).end()
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
