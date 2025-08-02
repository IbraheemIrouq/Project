//some functions may not be available in the website , because had perssure , because of exams and
//more things , so we couldnt finish all of them

const express = require('express');
const router = express.Router();

const carController = require('../controllers/carController');
const { authenticateToken } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const Car = require('../models/cars');

//check token for all routes
router.use(authenticateToken);

//add new car (all users)
router.post('/', carController.createCar);

//get all cars (all users)
router.get('/', carController.getCars);

//get one car by id (all users)
router.get('/:id', carController.getCarById);

//update car (admin only)
router.put('/:id', authorizeRoles('admin'), carController.updateCar);

//delete car (admin only)
router.delete('/:id', authorizeRoles('admin'), carController.deleteCar);

/* ===================================================== */

// get cars made after a year
router.get('/year/after/:year', async (req, res) => 
{
  const year = parseInt(req.params.year);

  if (isNaN(year)) 
  {
    return res.status(400).json({ message: 'invalid year' });
  }

  try 
  {
    let query = { year: { $gt: year } };

    //if not admin then show only user own cars
    if (req.user.role !== 'admin') 
    {
      query.owner = req.user.id;
    }

    const cars = await Car.find(query);
    res.json(cars);
  } 
  catch (err) 
  {
    res.status(500).json({ message: 'server error', error: err.message });
  }
});

module.exports = router;
