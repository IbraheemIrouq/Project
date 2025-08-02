const User = require('../models/users');

//update user profile
exports.updateProfile = async (req, res) => 
  {
  try 
  {
    const userId = req.user.id; 
    const { name, email, phone } = req.body;

    if (!name || !email) 
    {
      return res.status(400).json({ message: 'name and email are required' });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'user not found' });

    return res.json({
      message: 'profile updated',
      user: 
      {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone || ''
      }
    });
  } 
  catch (err) 
  {
    console.error('update error:', err);
    return res.status(500).json({ message: 'server error', error: err.message });
  }
};
