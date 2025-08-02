//get token from local storage
const token = localStorage.getItem('token');

//if no token, go to login page
if (!token) 
{
  alert('login required');
  window.location.href = 'Login.html';
}

//check if user is admin
try 
{
  const payload = JSON.parse(atob(token.split('.')[1]));
  if (payload.role !== 'admin') 
  {
    alert('you are not allowed here');
    window.location.href = 'index.html';
  }
} 
catch (e) 
{
  alert('invalid token');
  window.location.href = 'Login.html';
}

//show message on screen
function showNotification(msg) 
{
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3000);
}

//get headers for request
function getAuthHeaders() 
{
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  };
}

//load all cars
async function loadCars() 
{
  try 
  {
    const res = await fetch('/api/cars', {
      headers: getAuthHeaders()
    });

    const cars = await res.json();
    const container = document.getElementById('cars-container');
    container.innerHTML = '';

    //show each car
    cars.forEach(car => 
    {
      const card = document.createElement('div');
      card.className = 'car-card';
      card.innerHTML = `
        <h3>${car.brand} ${car.model}</h3>
        <p>year: ${car.year}</p>
        <p>plate: ${car.licensePlate}</p>
        <button onclick="deleteCar('${car._id}')">delete</button>
      `;
      container.appendChild(card);
    });

  } 
  catch (err) 
  {
    showNotification('error loading cars');
  }
}

//delete car by id
async function deleteCar(id) 
{
  const ok = confirm('are you sure?');
  if (!ok) return;

  try 
  {
    const res = await fetch(`/api/cars/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (res.ok) 
    {
      showNotification('car deleted');
      loadCars();
    } 
    else
    {
      const data = await res.json();
      showNotification(data.message || 'failed to delete car');
    }
  } 
  catch (err) 
  {
    showNotification('error deleting car');
  }
}

//when form is submitted
document.getElementById('add-car-form').addEventListener('submit', async function (e) 
{
  e.preventDefault();

  const newCar = {
    brand: document.getElementById('brand').value,
    model: document.getElementById('model').value,
    year: document.getElementById('year').value,
    licensePlate: document.getElementById('licensePlate').value
  };

  try 
  {
    const res = await fetch('/api/cars', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newCar)
    });

    if (res.ok) 
    {
      showNotification('car added');
      document.getElementById('add-car-form').reset();
      loadCars();
    } 
    else 
    {
      const data = await res.json();
      showNotification(data.message || 'failed to add car');
    }

  } 
  catch (err) 
  {
    showNotification('error adding car');
  }
});

//run when page opens
loadCars();
