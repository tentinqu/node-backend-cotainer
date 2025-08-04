require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// =============================================
// Database Setup (with mock option)
// =============================================

let useMockDB = true; // Set to false to use real MongoDB

if (!useMockDB) {
  // Real MongoDB Connection
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bearapi', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  var Bear = require('./app/models/bear');
} else {
  // Mock Database
  console.log('Using mock database - no MongoDB required');
  let bears = [];
  let nextId = 1;

  // Mock Bear model
  class MockBear {
    constructor(data) {
      this._id = nextId++;
      this.name = data.name;
    }

    static find(cb) {
      cb(null, bears);
    }

    static findById(id, cb) {
      const bear = bears.find(b => b._id == id);
      cb(null, bear);
    }

    save(cb) {
      bears.push(this);
      cb(null, this);
    }

    static remove({_id}, cb) {
      bears = bears.filter(b => b._id != _id);
      cb(null, {});
    }
  }

  var Bear = MockBear;
}

// =============================================
// API Routes
// =============================================

const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.json({ message: 'API is working! Try /api/bears' });
});

// Bear routes
router.route('/bears')
  .post((req, res) => {
    const bear = new Bear({ name: req.body.name });
    bear.save((err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Bear created!', bear });
    });
  })
  .get((req, res) => {
    Bear.find((err, bears) => {
      if (err) return res.status(500).send(err);
      res.json(bears);
    });
  });

router.route('/bears/:bear_id')
  .get((req, res) => {
    Bear.findById(req.params.bear_id, (err, bear) => {
      if (err) return res.status(500).send(err);
      if (!bear) return res.status(404).send('Bear not found');
      res.json(bear);
    });
  })
  .put((req, res) => {
    Bear.findById(req.params.bear_id, (err, bear) => {
      if (err) return res.status(500).send(err);
      if (!bear) return res.status(404).send('Bear not found');
      
      bear.name = req.body.name;
      bear.save((err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Bear updated!', bear });
      });
    });
  })
  .delete((req, res) => {
    Bear.remove({ _id: req.params.bear_id }, (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Bear deleted!' });
    });
  });

app.use('/api', router);

// =============================================
// Start Server
// =============================================

app.listen(port, () => {
  console.log(`Magic happens on port ${port}`);
  console.log(`Using ${useMockDB ? 'MOCK database' : 'REAL MongoDB'}`);
  console.log(`Try these endpoints:
  GET /api
  GET /api/bears
  POST /api/bears { "name": "Yogi" }`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});