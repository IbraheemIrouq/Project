//ask the user for their name once and save it
let userName = localStorage.getItem('username');

if (!userName)
{
  userName = prompt("What's your name?");
  if (userName)
  {
    localStorage.setItem('username', userName);
  }
  else
  {
    userName = "guest"; 
  }
}

//save car state or start with default values
let carState = JSON.parse(localStorage.getItem('carState')) || 
{
  engine: false,
  ac: false,
  acTemp: 22,
  acMode: 'cold', 
  doors: false,
  lights: false,
  trunk: false,
  horn: false
};

const hornSound = new Audio('Sounds/double-car-horn.mp3');
const clickSound = new Audio('click.mp3');

let notificationTimeout = null;

//save car state to local storage
function saveState()
{
  localStorage.setItem('carState', JSON.stringify(carState));
}

//show welcome message on pages 
function showWelcome()
{
  const welcomeElem = document.getElementById("welcome-msg");
  if (welcomeElem)
  {
    welcomeElem.textContent = `Welcome, ${userName}!`;
  }
}

function loadStatusPage()
{
  fetch('car-data.json')
    .then(res => res.json())
    .then(data =>
    {
      const ul = document.getElementById('car-status-list');
      if (ul)
      {
        ul.innerHTML = `
          <li><strong>Location:</strong> ${data.location}</li>
          <li><strong>Distance from Home:</strong> ${data.distance_from_home} km</li>
          <li><strong>Speed:</strong> ${data.speed} km/h</li>
          <li><strong>Engine Temp:</strong> ${data.engine_temp} °C</li>
          <li><strong>Oil Temp:</strong> ${data.oil_temp} °C</li>
          <li><strong>Next Service:</strong> ${data.service_date}</li>
        `;
      }
      else
      {
        const mainContent = document.getElementById("main-content");
        if (mainContent)
        {
          mainContent.innerHTML = `
            <h2>Car Status</h2>
            <ul>
              <li><strong>Location:</strong> ${data.location}</li>
              <li><strong>Distance from Home:</strong> ${data.distance_from_home} km</li>
              <li><strong>Speed:</strong> ${data.speed} km/h</li>
              <li><strong>Engine Temp:</strong> ${data.engine_temp} °C</li>
              <li><strong>Oil Temp:</strong> ${data.oil_temp} °C</li>
              <li><strong>Next Service:</strong> ${data.service_date}</li>
            </ul>
          `;
        }
      }
    })
    .catch(() =>
    {
      const mainContent = document.getElementById("main-content");
      if (mainContent)
      {
        mainContent.innerHTML = `<p>error loading car data.</p>`;
      }
    });
}

function renderControls()
{
  const container = document.getElementById('controls-container') || document.getElementById("main-content");
  if (!container) return;

  container.innerHTML = `
    <div class="controls-grid">
      ${renderControl('engine', 'Toggle Engine')}
      <div>
        <button onclick="toggle('ac')">Turn A/C ${carState.ac ? 'Off' : 'On'}</button>
        <span id="icon-ac"></span>
        <div id="label-ac" class="status-label">${getLabel('ac')}</div>

        <div id="ac-controls" style="margin-top: 0.5rem; display: ${carState.ac ? 'flex' : 'none'}; flex-direction: column; align-items: center;">
          <button onclick="toggleACMode()" style="margin-bottom: 5px;">
            Switch to ${carState.acMode === 'cold' ? 'Hot 🔥' : 'Cold ❄️'}
          </button>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span id="ac-mode-icon" style="font-size: 1.6rem; color: gold;">
              ${carState.acMode === 'hot' ? '🔥' : '❄️'}
            </span>
            <button onclick="adjustACTemp(-1)">⬅</button>
            <span id="ac-temp" style="margin: 0 10px; font-weight: 700;">${carState.acTemp}°C</span>
            <button onclick="adjustACTemp(1)">➡</button>
          </div>
        </div>
      </div>
      ${renderControl('doors', 'Lock/Unlock Doors')}
      ${renderControl('lights', 'Headlights On/Off')}
      ${renderControl('trunk', 'Open/Close Trunk')}
      ${renderControl('horn', 'Horn', true)}
    </div>
  `;

  const hornBtn = document.querySelector('button[onclick="honkHorn()"]');
  if (hornBtn) hornBtn.classList.add('horn-button');

  updateIcons();
}

function renderControl(key, label, isHorn = false)
{
  return `
    <div>
      <button id="${isHorn ? 'horn-btn' : ''}" onclick="${isHorn ? 'honkHorn()' : `toggle('${key}')`}">${label}</button>
      <span id="icon-${key}"></span>
      <div id="label-${key}" class="status-label">${getLabel(key)}</div>
    </div>`;
}

function getLabel(key)
{
  switch (key)
  {
    case 'engine': return carState.engine ? 'running' : 'stopped';
    case 'doors': return carState.doors ? 'unlocked' : 'locked';
    case 'lights': return carState.lights ? 'lights on' : 'lights off';
    case 'trunk': return carState.trunk ? 'open' : 'closed';
    case 'horn': return carState.horn ? 'active - 2 sec...' : 'silent';
    case 'ac': return carState.ac ? 'on' : 'off';
    default: return '';
  }
}

function toggle(system)
{
  carState[system] = !carState[system];
  clickSound.play();
  saveState();

  switch(system)
  {
    case 'doors':
      showNotification(carState.doors ? 'fas fa-lock-open' : 'fas fa-lock', carState.doors ? 'car is unlocked' : 'car is locked');
      break;
    case 'engine':
      showNotification(carState.engine ? 'fas fa-car-side' : 'fas fa-power-off', carState.engine ? 'engine started' : 'engine stopped');
      break;
    case 'ac':
      showNotification(carState.ac ? 'fas fa-snowflake' : 'fas fa-temperature-high', carState.ac ? 'a/c turned on' : 'a/c turned off');
      break;
    case 'lights':
      showNotification(carState.lights ? 'fas fa-lightbulb' : 'fas fa-moon', carState.lights ? 'lights on' : 'lights off');
      break;
    case 'trunk':
      showNotification(carState.trunk ? 'fas fa-box-open' : 'fas fa-box', carState.trunk ? 'trunk opened' : 'trunk closed');
      break;
  }

  if (window.location.pathname.endsWith('controls.html'))
  {
    renderControls();
  }
}

function toggleACMode()
{
  carState.acMode = carState.acMode === 'hot' ? 'cold' : 'hot';

  const [min, max] = carState.acMode === 'hot' ? [25, 30] : [16, 24];

  if (carState.acTemp < min) carState.acTemp = min;
  if (carState.acTemp > max) carState.acTemp = max;

  saveState();

  showNotification(
    carState.acMode === 'hot' ? 'fas fa-fire' : 'fas fa-snowflake',
    `switched a/c to ${carState.acMode === 'hot' ? 'hot' : 'cold'}`
  );

  if (window.location.pathname.endsWith('controls.html'))
  {
    renderControls();
  }
}

function adjustACTemp(change)
{
  let newTemp = carState.acTemp + change;
  const [min, max] = carState.acMode === 'hot' ? [25, 30] : [16, 24];

  if (newTemp < min || newTemp > max) return;

  carState.acTemp = newTemp;
  saveState();

  const acTempElem = document.getElementById("ac-temp");
  const acModeIconElem = document.getElementById("ac-mode-icon");
  if(acTempElem) acTempElem.textContent = `${carState.acTemp}°c`;
  if(acModeIconElem) acModeIconElem.textContent = carState.acMode === 'hot' ? '🔥' : '❄️';

  clickSound.play();
  showNotification('fas fa-temperature-high', `a/c temperature: ${carState.acTemp}°c`);
}

function honkHorn()
{
  const hornBtn = document.getElementById('horn-btn');
  if (!hornBtn) return;

  hornBtn.disabled = true;
  hornBtn.style.filter = 'none';
  hornBtn.style.opacity = '0.6';

  carState.horn = true;
  hornSound.play();
  updateIcons();

  setTimeout(() =>
  {
    carState.horn = false;
    updateIcons();
    saveState();

    hornBtn.disabled = false;
    hornBtn.style.filter = '';
    hornBtn.style.opacity = '1';
  }, 2000);
}

function updateIcons()
{
  for (const key in carState)
  {
    const icon = document.getElementById(`icon-${key}`);
    const label = document.getElementById(`label-${key}`);
    if (!icon) continue;

    let iconSymbol = carState[key] ? '🔓' : '🔒';
    let color = carState[key] ? 'green' : 'red';

    if (key === 'engine') iconSymbol = carState[key] ? '⏻' : '⏼';
    if (key === 'ac') iconSymbol = carState[key] ? '⏻' : '⏼';
    if (key === 'lights') iconSymbol = carState[key] ? '🔆' : '🌙';
    if (key === 'trunk') iconSymbol = carState[key] ? '📪' : '📫';
    if (key === 'horn') iconSymbol = carState[key] ? '📢' : '🔕';
    if (key === 'doors') iconSymbol = carState[key] ? '🔓' : '🔒';

    icon.textContent = iconSymbol;
    icon.style.color = color;
    icon.style.marginLeft = '10px';
    icon.style.fontSize = '1.5rem';

    if (label) label.textContent = getLabel(key);
  }
}

function showNotification(iconClass, message, duration = 3500)
{
  const notification = document.getElementById('notification');
  if (!notification) return;

  if (notificationTimeout)
  {
    clearTimeout(notificationTimeout);
  }

  notification.innerHTML = `<i class="${iconClass}"></i> ${message}`;
  notification.classList.add('show');

  notificationTimeout = setTimeout(() =>
  {
    notification.classList.remove('show');
  }, duration);
}

function showHomeStatus()
{
  const overviewElem = document.querySelector(".car-overview");
  if (!overviewElem) return;
  
  const statusHTML = `
    <ul>
    <li><i class="fas fa-car"></i> <strong>Engine:</strong> ${carState.engine ? 'running' : 'stopped'}</li>
      <li><i class="fas fa-snowflake"></i> <strong>A/C:</strong> ${carState.ac ? 'on' : 'off'} (${carState.acTemp}°c, mode: ${carState.acMode})</li>
      <li><i class="fas fa-door-closed"></i> <strong>Doors:</strong> ${carState.doors ? 'unlocked' : 'locked'}</li>
      <li><i class="fas fa-lightbulb"></i> <strong>Lights:</strong> ${carState.lights ? 'on' : 'off'}</li>
      <li><i class="fas fa-car"></i> <strong>Trunk:</strong> ${carState.trunk ? 'open' : 'closed'}</li>
    </ul>
  `;

//append instead of replace
const existingImage = overviewElem.querySelector('.car-image');
overviewElem.innerHTML = '';
if (existingImage) overviewElem.appendChild(existingImage);
overviewElem.innerHTML += statusHTML;

}

document.addEventListener('DOMContentLoaded', () =>
{
  showWelcome();

  const path = window.location.pathname;
  if (path.endsWith('status.html'))
  {
    loadStatusPage();
  }
  else if (path.endsWith('controls.html'))
  {
    renderControls();
  }
  else
  {
    showHomeStatus();
  }
});

document.addEventListener('DOMContentLoaded', () =>
{
  const nearestGasBtn = document.getElementById('nearest-gas-btn');
  const mapOptions = document.getElementById('map-options');
  const btnWaze = document.getElementById('btn-waze');
  const btnGmaps = document.getElementById('btn-gmaps');
  const mapPreview = document.getElementById('map-preview');
  const mapImage = document.getElementById('map-image');

  //urls for preview images
  const previewImages = {
    waze: 'images/waze-preview.jpg',       
    gmaps: 'images/google-maps-preview.jpg'
  };

  if (nearestGasBtn)
  {
    nearestGasBtn.addEventListener('click', () =>
    {
      if (mapOptions.style.display === 'none' || mapOptions.style.display === '')
      {
        mapOptions.style.display = 'flex';
        mapPreview.style.display = 'none'; 
        mapImage.src = '';
        mapImage.alt = 'map preview';
      }
      else
      {
        mapOptions.style.display = 'none';
        mapPreview.style.display = 'none';
        mapImage.src = '';
      }
    });
  }

  //show waze
  if (btnWaze)
  {
    btnWaze.addEventListener('click', () =>
    {
      mapImage.src = previewImages.waze;
      mapImage.alt = 'waze map preview';
      mapPreview.style.display = 'block';
    });
  }

  //show google maps
  if (btnGmaps)
  {
    btnGmaps.addEventListener('click', () =>
    {
      mapImage.src = previewImages.gmaps;
      mapImage.alt = 'google maps preview';
      mapPreview.style.display = 'block';
    });
  }

  if (window.location.pathname.endsWith('support.html'))
  {
    const supportBtns = document.querySelectorAll('.support-btn');
    supportBtns.forEach(btn =>
    {
      btn.addEventListener('click', (e) =>
      {
        e.preventDefault(); 
        let functionName = btn.textContent.trim();
        alert(`this "${functionName}" function is under maintenance...`);
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", () =>
{
  const nearestGasBtn = document.getElementById("nearest-gas-btn");
  const mapOptions = document.getElementById("map-options");
  const btnWaze = document.getElementById("btn-waze");
  const btnGmaps = document.getElementById("btn-gmaps");
  const mapPreview = document.getElementById("map-preview");
  const mapImage = document.getElementById("map-image");
  const hideMapBtn = document.getElementById("hide-map-btn");

  //show map options (waze/google maps) when nearest gas station clicked
  nearestGasBtn.addEventListener("click", () =>
  {
    mapOptions.style.display = "flex";
    //hide the map and hide map button initially
    mapPreview.style.display = "none";
    mapImage.src = "";
  });

  btnWaze.addEventListener("click", () =>
  {
    mapImage.src = "images/waze-map-preview.png";  //show waze
    mapPreview.style.display = "block";
  });

  btnGmaps.addEventListener("click", () =>
  {
    mapImage.src = "images/google-map-preview.png";  //correct google 
    mapPreview.style.display = "block";
  });

  //hide map and reset images when hide map clicked
  hideMapBtn.addEventListener("click", () =>
  {
    mapPreview.style.display = "none";
    mapImage.src = "";
  });
});

document.getElementById("profile-form").addEventListener("submit", function (e)
{
  e.preventDefault();
  showNotification("profile updated successfully!");
});


//enforce authentication on protected pages
function enforceAuth() 
{
  const token = localStorage.getItem('token');
  if (!token) 
  {
    window.location.href = 'Login.html';
  }
}


function getAuthHeaders() 
{
  const token = localStorage.getItem('token');
  return 
  {
    'Content-Type'; 'application/json',
    'Authorization'; 'Bearer ' + token
  };
}

async function fetchCars() 
{
  try 
  {
    const response = await fetch('/api/cars', 
    {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) 
    {
      throw new Error(data.message || 'Failed to fetch cars');
    }

    //insert car data into UI
    const container = document.getElementById('controls-container');
    if (container) 
    {
      container.innerHTML = data.map(car => `
        <div class="car-control-card">
          <h3>${car.brand || 'Car'}</h3>
          <p>Status: ${car.status || 'N/A'}</p>
          <!-- Add more car details as needed -->
        </div>
      `).join('');
    }
  } 
  catch (err) 
  {
    console.error('Error fetching cars:', err);
    showNotification('Error loading cars: ' + err.message, 'error');
  }
}

if (document.getElementById('controls-container')) 
{
  fetchCars();
}


document.addEventListener('DOMContentLoaded', function() 
{
  //fill profile summary
  const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    name: 'Username',
    email: 'username@example.com',
    phone: '+972-50-1234567'
  };
  document.querySelector('.profile-card:nth-child(1) p:nth-child(2)').innerHTML = `<strong>Name:</strong> ${userProfile.name}`;
  document.querySelector('.profile-card:nth-child(1) p:nth-child(3)').innerHTML = `<strong>Email:</strong> ${userProfile.email}`;
  document.querySelector('.profile-card:nth-child(1) p:nth-child(4)').innerHTML = `<strong>Phone:</strong> ${userProfile.phone}`;

  //fill car info
  const carProfile = JSON.parse(localStorage.getItem('carProfile')) || {
    model: 'Audi A3',
    year: '2022',
    licensePlate: '12-345-67'
  };
  document.querySelector('.profile-card:nth-child(2) p:nth-child(2)').innerHTML = `<strong>Model:</strong> ${carProfile.model}`;
  document.querySelector('.profile-card:nth-child(2) p:nth-child(3)').innerHTML = `<strong>Year:</strong> ${carProfile.year}`;
  document.querySelector('.profile-card:nth-child(2) p:nth-child(4)').innerHTML = `<strong>License Plate:</strong> ${carProfile.licensePlate}`;

  //make profile save data
  document.getElementById('profile-form').onsubmit = function(e) {
    e.preventDefault();
    const updatedProfile = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value
    };
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    alert('Profile updated!');
    location.reload();
  };
});
