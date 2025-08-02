require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

const app = express(); 

const PORT = process.env.PORT || 3000;

//check env variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) 
{
  console.error('missing environment variables');
  process.exit(1);
}

//allow json and forms
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', require('./routes/userRoutes'));

//serve public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);

//car routes 
app.use('/api/cars', carRoutes);

//send login.html if no api match
app.get('/', (req, res) => 
{
  res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});

//connect to mongodb and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('mongodb connected');
  app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('mongo connection error:', err);
});
