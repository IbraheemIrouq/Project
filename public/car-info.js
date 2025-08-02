window.onload = function ()
{
  const carProfile = JSON.parse(localStorage.getItem('carProfile')) || {};
  document.getElementById('carBrand').value = carProfile.brand || '';
  document.getElementById('carModel').value = carProfile.model || '';
  document.getElementById('carYear').value = carProfile.year || '';
  document.getElementById('licensePlate').value = carProfile.licensePlate || '';

  document.getElementById('backToAccount').onclick = function () 
  {
    window.location.href = 'account.html';
  };
};

document.getElementById('carInfoForm').onsubmit = async function (e) 
{
  e.preventDefault();

  const carProfile = {
    brand: document.getElementById('carBrand').value,
    model: document.getElementById('carModel').value,
    year: document.getElementById('carYear').value,
    licensePlate: document.getElementById('licensePlate').value
  };

  localStorage.setItem('carProfile', JSON.stringify(carProfile));
  localStorage.setItem('carUpdateSuccess', '1');

  const token = localStorage.getItem('token');
  if (!token)
  {
    alert('missing token, please login again');
    return;
  }

  try 
  {
    const response = await fetch('/api/cars', {
      method: 'POST',
      headers: 
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(carProfile)
    });

    const data = await response.json();

    if (!response.ok) 
    {
      alert(data.message || 'error saving car info');
      return;
    }

    window.location.href = 'account.html';

  } 
  catch (err) 
  {
    console.error('submit error:', err);
    alert('server error while saving car info');
  }
};
