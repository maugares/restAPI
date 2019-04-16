///////////////////////////////
///        API SETUP        ///
///////////////////////////////

//-- Require Express --//
const express = require('express')
const app = express()

//-- Create server on port 4000 --//
const port = 4000
app.listen(port, () => `Listening on port ${port}`)


//-- Connect Sequelize with the Postgres server --//
const Sequelize = require('sequelize')
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const sequelize = new Sequelize(connectionString,
  {
    define:
    {
      timestamps: false,  // Prevent timestamps
      logging: false      // Prevent SQL logging
    }
  }
)

//-- Add a body parser for dealing with POST requests --//
const bodyParser = require('body-parser')
app.use(bodyParser.json())


//////////////////////////////
///        API BODY        ///
//////////////////////////////

//-- Create a table by using Sequelize --//
const House = sequelize.define('house', {
  title: Sequelize.STRING,
  address: Sequelize.TEXT,
  size: Sequelize.INTEGER,
  price: Sequelize.INTEGER
}, {
    tableName: 'houses'
  })

//-- Sync the table with the database when the app starts --//
House.sync()

/////////////
///  GET  ///
/////////////

//-- Get all houses --//
app.get('/houses', function (req, res, next) {
  House
    .findAll()
    .then(houses => {
      res.json({ houses: houses })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      })
    })
})

//-- Get a particular house based on its id --//
app.get('/houses/:id', function (req, res, next) {
  const id = req.params.id
  House
    .findByPk(id)
    .then(house => {
      res.json({ house: house.dataValues })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      })
    })
})


///////////////
///  POST   ///
///////////////

// To run it add POST in front of the request:
// e.g.: http POST :4000/houses

//--  Create a new house  --//
app.post('/houses', function (req, res) {
  House
    .create({
      title: 'house6',
      address: 'Hoofdweg, 23',
      size: 66,
      price: 1450
    })
    .then(house => res.status(201).json(house))
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      })
    })
})


//////////////
///  PUT   ///
//////////////

//--  Update a specific house  --//
app.put('/houses/:id', function (req, res) {
  const id = req.params.id
  House

    // select the house to update
    .findByPk(id)

    // update the house
    .then(house => house.update({
      title: 'best house'
    }))

    // inform the client about the actions taken
    .then(house => {
      console.log(`The house with ID ${house.dataValues.id} is now updated`, house.dataValues)
      res.status(200).json({
        // message: `The house with ID ${house.dataValues.id} is now updated`, 
        house
      })
    })

    // inform the client in case of errors
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong in the PUT method',
        error: err
      })
    })
})

/////////////////
///  DELETE   ///
/////////////////

//--  Deleting a specific house  --//
app.delete('/houses/:id', function (req, res) {
  const id = req.params.id
  House
    .findByPk(id)

    .then(house => {
      house.destroy(house)
      res.status(200).json(`The house with ID ${id} has been deleted`)
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong in the PUT method',
        error: err
      })
    })
})
