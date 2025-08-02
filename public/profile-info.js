//load profile data
window.onload = function () 
{
  const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
  document.getElementById('name').value = userProfile.name || '';
  document.getElementById('email').value = userProfile.email || '';
  document.getElementById('phone').value = userProfile.phone || '';

  document.getElementById('backToAccount').onclick = function () 
  {
    window.location.href = 'account.html';
  };
};

//when user submits profile
document.getElementById('profileInfoForm').onsubmit = async function (e) 
{
  e.preventDefault();

  const storedProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
  const userProfile = 
{
  id: storedProfile.id,
  name: document.getElementById('name').value,
  email: document.getElementById('email').value,
  phone: document.getElementById('phone').value
};


  const token = localStorage.getItem('token');
  if (!token) 
  {
    alert('missing token, please login again');
    return;
  }

  try 
  {
    const response = await fetch('/api/users/update', {
      method: 'PUT',
      headers: 
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(userProfile)
    });

    const data = await response.json();

    if (!response.ok) 
    {
      alert(data.message || 'error updating profile');
      return;
    }

    //save updated data locally
    localStorage.setItem('userProfile', JSON.stringify(data.user));
    localStorage.setItem('profileUpdateSuccess', '1');

    window.location.href = '/account.html';

  } 
  catch (err) 
  {
    console.error('submit error:', err);
    alert('server error while updating profile');
  }
};
