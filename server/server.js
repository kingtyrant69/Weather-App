const express = require('express');
const app = express();
const port = 8000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Cities = require('./models/cities');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// mongodb+srv://aashi2673:vxegsdB7K477Op0G@cluster0.76v0orf.mongodb.net/?retryWrites=true&w=majority
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://amanagarwal1509:aman@1509@cluster0.eyhty.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
connectDB();

app.get('/', (req, res) => {
  res.send('PORT 8000');
});

app.get('/api/cities', async (req, res) => {
  const { email } = req.query;
  try {
    const cities = await Cities.find({ email }); // Find all cities with the provided email

    return res.status(200).json(cities);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});



app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  // Create a new user in the database
  try {
    // Create a new user in the database
    const newUser = new User({ email, password });
    await newUser.save();

    return res.status(200).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'An error occurred during registration' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  let user = await User.findOne({ email });
  // Find the user with the provided email
  if (!user) {
    res.status(200).json({ success: false, message: 'No user found' });
  } else {
    // Compare the hashed password with the provided password
    if (password === user.password) {
      res.status(200).json({ success: true, user: { email: user.email }, message: 'User found' });
    } else {
      res.status(200).json({ success: false, message: 'Invalid password' });
    }
  }
});

app.post('/api/cities', async (req, res) => {
  const { email, cityname } = req.body;
  console.log(cityname);
  try {
    // Create a new city entry
    const newCity = new Cities({ email, cityname });
    await newCity.save();

    return res.status(200).json({ message: 'City added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});

app.delete('/api/cities/:cityname', async (req, res) => {
  const { cityname } = req.params;

  try {
    // Find and delete the city
    const deletedCity = await Cities.findOneAndDelete({ cityname });

    if (!deletedCity) {
      return res.status(404).json({ message: 'City not found' });
    }

    return res.json({ message: 'City deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'An error occurred while deleting the city' });
  }
});


// Catch-all route for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening on port http://localhost:' + port);
});
