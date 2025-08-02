const Car = require('../models/cars');

/* =================================================================== */

//get all cars
exports.getCars = async (req, res) => 
  {
  try 
  {
    const cars = await Car.find();
    res.json(cars);
  } 
  catch (err) 
  {
    res.status(500).json({ message: 'error getting cars', error: err.message });
  }
};

/* =================================================================== */

//get car by id
exports.getCarById = async (req, res) => 
  {
  try 
  {
    const car = await Car.findById(req.params.id);
    if (!car) 
    {
      return res.status(404).json({ message: 'car not found' });
    }
    res.json(car);
  } 
  catch (err) 
  {
    res.status(500).json({ message: 'error getting car', error: err.message });
  }
};

/* =================================================================== */

//create new car
exports.createCar = async (req, res) => 
  {
  try 
  {
    //get data from body
    const { brand, model, year, licensePlate } = req.body;

    //check required fields
    if (!brand || !model || !year || !licensePlate) 
    {
      return res.status(400).json({ message: 'all fields are required' });
    }

    //make simple car id
    const carId = 'CAR' + Date.now();

    //create new car
    const newCar = new Car({
      carId,
      brand,
      model,
      year,
      licensePlate,
      owner: req.user.id
    });

    //save to database
    await newCar.save();

    //send success message
    res.status(201).json({ message: 'car created', car: newCar });

  }
  catch (err) 
  {
    console.error(err); 
    res.status(500).json({ message: 'error creating car' });
  }
};

/* =================================================================== */

//update car
exports.updateCar = async (req, res) => 
  {
  try 
  {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCar);
  } 
  catch (err) 
  {
    res.status(400).json({ message: 'error updating car', error: err.message });
  }
};

/* =================================================================== */

//delete car
exports.deleteCar = async (req, res) => 
  {
  try 
  {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'car deleted' });
  } 
  catch (err) 
  {
    res.status(500).json({ message: 'error deleting car', error: err.message });
  }
};
