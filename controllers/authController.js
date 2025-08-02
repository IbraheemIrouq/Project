const User = require('../models/users');
const Car = require('../models/cars'); 
const jwt = require('jsonwebtoken');

//=====================================================================================================================
//register new user
exports.register = async (req, res) => 
  {
  try 
  {
    const { name, email, phone, password, confirm_password, role } = req.body;


    if (!name || !email || !password || !confirm_password) 
    {
      return res.status(400).json({ message: 'all fields are required' });
    }

    if (password !== confirm_password) 
    {
      return res.status(400).json({ message: 'passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) 
    {
      return res.status(409).json({ message: 'email already registered' });
    }

    const user = new User({ name, email, phone, password, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      message: 'user registered',
      user: 
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } 
  catch (err) 
  {
    console.error('register error:', err);
    return res.status(500).json({ message: 'server error', error: err.message });
  }
};

//====================================================================================
//login user
exports.login = async (req, res) => 
  {
  try 
  {
    const { email, password } = req.body;

    if (!email || !password) 
    {
      return res.status(400).json({ message: 'email and password required' });
    }

    const user = await User.findOne({ email });

    if (!user) 
    {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const match = await user.comparePassword(password);
    if (!match) 
    {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    //get car info if available
    const car = await Car.findOne({ owner: user._id });

    return res.json({
      message: `welcome back, ${user.name}`,
      user: 
      {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        car: car
          ? {
              brand: car.brand,
              model: car.model,
              year: car.year,
              licensePlate: car.licensePlate
            }
          : null
      },
      token
    });
  } 
  catch (err) 
  {
    console.error('login error:', err);
    return res.status(500).json({ message: 'server error', error: err.message });
  }
};
