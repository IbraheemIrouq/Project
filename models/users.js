const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
},
{ timestamps: true }
);

userSchema.pre('save', async function(next)
{
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//check password
userSchema.methods.comparePassword = function(candidatePassword)
{
  return bcrypt.compare(candidatePassword, this.password);
};

//check if admin
userSchema.methods.isAdmin = function()
{
  return this.role === 'admin';
};

module.exports = mongoose.model('User', userSchema);
