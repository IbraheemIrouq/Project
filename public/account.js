//show data from local storage on the page
function syncAccount() 
{
  const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};

  //update profile fields
  document.getElementById('summaryName').textContent = userProfile.name || '';
  document.getElementById('summaryEmail').textContent = userProfile.email || '';
  document.getElementById('summaryPhone').textContent = userProfile.phone || '';

  const carProfile = JSON.parse(localStorage.getItem('carProfile')) || {};

  //update car fields
  document.getElementById('summaryCarBrand').textContent = carProfile.brand || '';
  document.getElementById('summaryCarModel').textContent = carProfile.model || '';
  document.getElementById('summaryCarYear').textContent = carProfile.year || '';
  document.getElementById('summaryLicensePlate').textContent = carProfile.licensePlate || '';
}

//when page is ready
document.addEventListener('DOMContentLoaded', function () 
{
  syncAccount();

  if (localStorage.getItem('profileUpdateSuccess') === '1') 
  {
    localStorage.removeItem('profileUpdateSuccess');
    setTimeout(function () 
    {
      alert('profile saved');
    }, 200);
  }

  //show message if car info was saved
  if (localStorage.getItem('carUpdateSuccess') === '1') 
  {
    localStorage.removeItem('carUpdateSuccess');
    setTimeout(function () 
    {
      alert('car info updated');
    }, 200);
  }

  //check if the user is admin
  const token = localStorage.getItem('token');
  if (token) 
  {
    try 
    {
      const payload = JSON.parse(atob(token.split('.')[1]));

      //if admin show admin button
      if (payload.role === 'admin') 
      {
        const adminContainer = document.getElementById('admin-button-container');
        if (adminContainer) 
        {
          adminContainer.style.display = 'block';
        }
      }
    } 
    catch (e) 
    {
      //if token is broken ignore
    }
  }
});

//go to admin page
function goToAdmin() 
{
  window.location.href = 'admin.html';
}

//logout and remove all data
function logout() 
{
  localStorage.clear();
  window.location.href = 'Login.html';
}
