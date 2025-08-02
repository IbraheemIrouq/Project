const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const notification = document.getElementById('notification');

//show simple message
function showNotification(message, type = 'success')
{
  if (!notification) return;
  notification.textContent = message;
  notification.className = '';
  notification.classList.add(type);
  notification.style.display = 'block';
  setTimeout(() => { notification.style.display = 'none'; }, 4000);
}

if (loginForm)
{
  loginForm.addEventListener('submit', async (e) =>
  {
    e.preventDefault();

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    if (!email || !password)
    {
      showNotification('please enter email and password', 'error');
      return;
    }

    try
    {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data;
      try
      {
        data = await res.json();
      }
      catch (err)
      {
        throw new Error('invalid server response');
      }
      if (!res.ok)
      {
        throw new Error(data.message || 'login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.message || email);

      showNotification('login success! redirecting...');
      setTimeout(() => window.location.href = 'index.html', 1000);
    }
    catch (err)
    {
      showNotification('login error: ' + err.message, 'error');
    }
  });
}

if (registerForm)
{
  registerForm.addEventListener('submit', async (e) =>
  {
    e.preventDefault();

    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value;
    const confirmPassword = registerForm.confirm_password.value;

    if (!name || !email || !password || !confirmPassword)
    {
      showNotification('fill all fields', 'error');
      return;
    }

    if (password !== confirmPassword)
    {
      showNotification('passwords not same', 'error');
      return;
    }

    try
    {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirm_password: confirmPassword })
      });

      let data;
      try
      {
        data = await res.json();
      }
      catch (err)
      {
        throw new Error('invalid server response');
      }

      if (!res.ok)
      {
        throw new Error(data.message || 'register failed');
      }

      localStorage.setItem('token', data.token);
      showNotification('registered! going to login...');
      setTimeout(() => window.location.href = 'login.html', 1200);
    }
    catch (err)
    {
      showNotification('register error: ' + err.message, 'error');
    }
  });
}
