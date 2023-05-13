const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateDate(dateString) {
  const regex = /^\d{4}\/\d{2}\/\d{2}$/
  return regex.test(dateString)
}

function validateObject(obj) {
  const emptyProps = []
  for (const key in obj) {
    const val = obj[key]
    if (val === null || val === undefined || val === '') {
      emptyProps.push(key)
    } else if (typeof val === 'object') {
      const subEmptyProps = validateObject(val)
      if (subEmptyProps.length > 0) {
        emptyProps.push(`${key}: { ${subEmptyProps.join(', ')} }`)
      }
    }
  }
  return emptyProps
}

// Add participant
app.post('/participants/add', async (req, res) => {

  try {
    const emptyProps = validateObject(req.body);
    if (emptyProps.length > 0) {
      return res.status(400).json({ status: "error", message: `${emptyProps[0]} is empty` }).end();
    }

    const email = req.body.personal.email
    if (!validateEmail(email)) {
      return res.status(400).json({ status: "error", message: `Email not valid!.` }).end();
    }

    if (!validateDate(req.body.personal.dob)) {
      return res.status(400).json({ status: "error", message: `Date of Birth not valid!.` }).end();
    }

    const data = await db.collection('participants').set(email, req.body)
    console.log(JSON.stringify(data, null, 2))
    return res.status(200).json({
      status: "success",
      data
    }).end();

  } catch (err) {
    return res.status(500).json({ status: "error", message: 'Internal server error', error: err }).end();
  }
})

// Get a full listing of participants
app.get('/participants', async (req, res) => {

  try {
    const { results: data } = await db.collection('participants').filter()
    console.log(JSON.stringify(data))
    return res.status(200).json({
      status: "success",
      data
    }).end();

  } catch (err) {
    return res.status(500).json({ status: "error", message: 'Internal server error', error: err }).end();

  }
})

// Get a full listing of participants personal details
app.get('/participants/details', async (req, res) => {

  try {
    const { results: items } = await db.collection('participants').filter()
    const data = items.filter(el => el.props.active == true).map(e => e.props.personal)
    console.log(JSON.stringify(data))
    return res.status(200).json({
      status: "success",
      data
    }).end();

  } catch (err) {
    return res.status(500).json({ status: "error", message: 'Internal server error', error: err }).end();
  }
})

// Get a full listing deleted participants
app.get('/participants/details/deleted', async (req, res) => {
  try {
    const { results: items } = await db.collection('participants').filter()
    const data = items.filter(el => el.props.active == false).map(e => e.props.personal)
    console.log(JSON.stringify(data))
    return res.status(200).json({
      status: "success",
      data
    }).end();

  } catch (err) {
    return res.status(500).json({ status: "error", message: 'Internal server error', error: err }).end();

  }

})

// Get a single participant
app.get('/participants/details/:email', async (req, res) => {
  const email = req.params.email

  if (!validateEmail(email)) {
    return res.status(400).json({ status: "error", message: `Email not valid!.` }).end();
  }

  try {
    const item = (await db.collection('participants').get(email))?.props
    if (item.active == false) {
      return res.status(400).json({ status: "error", message: 'Deleted Participant' }).end();

    }
    const data = { ...item.personal, active: item.active }
    console.log(JSON.stringify(data, null, 2))
    return res.status(200).json({
      status: "success",
      data
    }).end();

  } catch (err) {
    return res.status(500).json({ status: "error", message: 'Internal server error', error: err }).end();
  }
})

// Get a single item participant's work info
app.get('/participants/work/:email', async (req, res) => {
  const email = req.params.email

  if (!validateEmail(email)) {
    return res.status(400).json({ status: "error", message: `Email not valid!.` }).end();
  }

  try {
    const item = (await db.collection('participants').get(email))?.props
    if (item.active == false) {
      return res.status(400).json({ status: "error", message: 'Deleted Participant' }).end();

    }
    const data = item.work;
    console.log(JSON.stringify(data, null, 2))
    return res.status(200).json({
      status: "success",
      data
    }).end();

  } catch (err) {
    return res.status(500).json({ status: "error", message: 'Internal server error', error: err }).end();
  }
})

// Get a single participant home info
app.get('/participants/home/:email', async (req, res) => {
  const email = req.params.email

  if (!validateEmail(email)) {
    return res.status(400).json({ status: "error", message: `Email not valid!.` }).end();
  }

  try {
    const item = (await db.collection('participants').get(email))?.props
    if (item.active == false) {
      return res.status(400).json({ status: "error", message: 'Deleted Participant' }).end();

    }
    const data = item.home;
    console.log(JSON.stringify(data, null, 2))
    return res.status(200).json({
      status: "success",
      data
    }).end();

  } catch (err) {
    return res.status(500).json({ status: "error", message: 'Internal server error', error: err }).end();
  }
})

// Delete an participant
app.delete('/participants/:email', async (req, res) => {
  const email = req.params.email

  if (!validateEmail(email)) {
    return res.status(400).json({ status: "error", message: `Email not valid!.` }).end();
  }

  try {
    const item = (await db.collection('participants').get(email))
    const key = item.key
    const { work, home, personal } = item.props

    const data = await db.collection('participants').set(key, { personal, home, work, active: false })
    console.log(JSON.stringify(data, null, 2))
    return res.status(200).json({
      status: "success",
      data
    }).end();

  } catch (err) {
    return res.status(500).json({ status: "error", message: 'Internal server error', error: err }).end();
  }
})

// Update an participant
app.put('/participants/:email', async (req, res) => {
  const body = req.body

  const emptyProps = validateObject(req.body);
  if (emptyProps.length > 0) {
    return res.status(400).json({ status: "error", message: `${emptyProps[0]} is empty` }).end();
  }

  const email = req.params.email
  if (!validateEmail(email)) {
    return res.status(400).json({ status: "error", message: `Email not valid!.` }).end();
  }

  if (!validateDate(req.body.personal.dob)) {
    return res.status(400).json({ status: "error", message: `Date of Birth not valid!.` }).end();
  }

  try {
    const data = await db.collection('participants').set(email, body)
    console.log(JSON.stringify(data, null, 2))
    return res.status(200).json({
      status: "success",
      data
    }).end();

  } catch (err) {
    return res.status(500).json({ status: "error", message: 'Internal server error', error: err }).end();
  }
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
