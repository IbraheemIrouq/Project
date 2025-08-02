document.getElementById('login-form').addEventListener('submit', function (e) 
{
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) 
      {
        //save token
        localStorage.setItem('token', data.token);

        try 
        {
          //decode token
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          localStorage.setItem('role', payload.role);

          const user = data.user;
          localStorage.setItem('userProfile', JSON.stringify({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || ''
          }));

          if (user.car) 
          {
            localStorage.setItem('carProfile', JSON.stringify({
              brand: user.car.brand || '',
              model: user.car.model || '',
              year: user.car.year || '',
              licensePlate: user.car.licensePlate || ''
            }));
          } 
          else 
          {
            localStorage.removeItem('carProfile');
          }

          //redirect based on role
          if (payload.role === 'admin') 
          {
            window.location.href = 'admin.html';
          } 
          else 
          {
            window.location.href = 'index.html';
          }

        } 
        catch (err) 
        {
          console.error('token decode error:', err);
          alert('invalid token');
        }

      } 
      else 
      {
        alert(data.message || 'login failed');
      }
    })
    .catch(err => {
      console.error(err);
      alert('error logging in');
    });
});
