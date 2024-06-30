const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/movie-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  showtime: String,
});

const User = mongoose.model('User', userSchema);
const Movie = mongoose.model('Movie', movieSchema);

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  try {
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, 'secret');
    res.json({ token });
  } else {
    res.status(400).send('Invalid credentials');
  }
});

app.get('/api/movies', async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
