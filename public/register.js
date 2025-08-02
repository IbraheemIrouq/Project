//when user clicks submit button
document.getElementById('registerForm').onsubmit = async function (e) 
{
  e.preventDefault(); //stop page from refreshing

  const form = e.target;

  const data = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value, 
    password: form.password.value,
    confirm_password: form.confirm_password.value
  };

  //send data to server
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (res.ok) 
  {
    //save user info to localStorage
    localStorage.setItem('token', result.token);
    localStorage.setItem('userProfile', JSON.stringify({
      id: result.user.id || '',          
      name: result.user.name || '',
      email: result.user.email || '',
      phone: result.user.phone || '',
      role: result.user.role || ''        
    }));

    //go to car info page
    window.location.href = '/car-info.html';
  } 
  else
  {
    alert(result.message || 'register error');
  }
};
