const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
{
  carId: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  available: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},
{ timestamps: true }
);

carSchema.index({ brand: 1 });

carSchema.index({ year: 1 });

module.exports = mongoose.model('Car', carSchema);
