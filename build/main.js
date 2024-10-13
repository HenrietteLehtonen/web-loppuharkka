'use strict';

// HTML TAULUKON RIVIT
const restaurantRow = (restaurant) => {
    const { name, address, company } = restaurant;
    const rivi = document.createElement('tr');
    // nimi
    const nameCell = document.createElement('td');
    nameCell.innerText = name;
    // osoite
    const addressCell = document.createElement('td');
    addressCell.innerText = address;
    // company
    const companyCell = document.createElement('td');
    companyCell.innerText = company;
    // div napeille flexiä varten
    const buttonContainer = document.createElement('div');
    buttonContainer.setAttribute("id", "button-container");
    // napit
    const dailyMenuBtn = document.createElement('button');
    dailyMenuBtn.setAttribute("class", "show-menu-btn");
    dailyMenuBtn.innerText = "Daily Menu";
    const weeklyMenuBtn = document.createElement('button');
    weeklyMenuBtn.setAttribute("class", "show-menu-btn");
    weeklyMenuBtn.innerText = "Weekly Menu";
    // napit divin sisään
    buttonContainer.appendChild(dailyMenuBtn);
    buttonContainer.appendChild(weeklyMenuBtn);
    //  td nappidiville
    const buttonCell = document.createElement('td');
    buttonCell.appendChild(buttonContainer); // lisätään nappidiv solu-elementtiin
    // lisätään riville
    rivi.appendChild(nameCell);
    rivi.appendChild(addressCell);
    rivi.appendChild(companyCell);
    rivi.appendChild(buttonCell);
    // rivi.appendChild(weeklyMenuBtn);
    // palautetaan rivit ja niiden buttonit -> voidaan hakea rivikohtaiset tiedot buttoneilla
    return { rivi, dailyMenuBtn, weeklyMenuBtn };
};
// LUODAAN RAFLA MODAALIIN SISÄLTÖ - DAILY MENU
const restaurantModal = (restaurant, menu) => {
    const { name, address, city, postalCode, phone, company } = restaurant;
    let html = `
    <div class="dialog-container">
      <h2>${name}</h2>
      <h3>${company}</h3>
      <h3>${address} ${postalCode} ${city}</h3>
      <h3>${phone}</h3>
    </div>
      <table>
        <tr>
          <th>Ruokalaji</th>
          <th>Allergeenit</th>
          <th>Hinta</th>
        </tr>

    `;
    menu.courses.forEach((course) => {
        const { name, diets, price } = course;
        html += `
          <tr>
            <td>${name}</td>
            <td>${diets ?? ' - '}</td>
            <td>${price ?? ' - '}</td>
          </tr>
          `;
    });
    html += '</table>';
    return html;
};
const errorModal = (message) => {
    const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
    return html;
};
// WEEKLY MODAL
const weeklyModal = (restaurant, menu) => {
    const { name, address, city, postalCode, phone, company } = restaurant;
    let html = `
    <div class="dialog-container">
      <h2>${name}</h2>
      <h3>${company}</h3>
      <h3>${address} ${postalCode} ${city}</h3>
      <h3>${phone}</h3>
    </div>
      <table>
        <tr>
          <th>Päivä</th>
          <th>Ruokalaji</th>
          <th>Allergeenit</th>
          <th>Hinta</th>
        </tr>

    `;
    menu.days.forEach((day) => {
        const { date, courses } = day;
        // tekee oman rivin päivälle
        // html += `
        //   <tr>
        //     <td>${date}</td>
        //   </tr>
        // `;
        courses.forEach((course, päivä) => {
            const { name, diets, price } = course;
            html += `
        <tr>
          <td id=date-menu>${päivä === 0 ? date : ''}</td> <!-- päivämäärä ekalle riville --!>
          <td>${name}</td>
          <td>${diets ?? ' - '}</td>
          <td>${price ?? ' - '}</td>
        </tr>
      `;
        });
    });
    html += '</table>';
    return html;
};

const fetchData = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Error ${response.status} occured`);
    }
    const json = response.json();
    return json;
};

const apiUrl = 'https://media1.edu.metropolia.fi/restaurant/api/v1';
const positionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

// import mapboxgl from 'mapbox-gl';
const infoBtn = document.querySelector("#info-btn");
const infoDialog = document.querySelector("#dialog-info");
const closeInfoBtn = document.querySelector('#info-btn-close');
const dialog = document.querySelector(".dialog-login");
const loginBtn = document.querySelector("#login-btn");
const closeBtn = document.querySelector("#close-btn");
// TOGLLE
const checkbox = document.getElementById("checkbox");
if (!checkbox) {
    console.error("Checkbox not found");
}
else {
    console.log("Checkbox found");
}
// Toggle dark mode
function toggleDark() {
    console.log('toggle');
    document.documentElement.classList.toggle('dark');
}
// Checkbox change event
checkbox.addEventListener("change", () => {
    toggleDark(); // Kutsutaan funktiota kun checkboxin tila muuttuu
});
// INFO DIALOG
infoBtn.addEventListener('click', () => {
    console.log('click');
    infoDialog.showModal();
});
// LOGIN DIALOGI
// Login avaa dialogin
loginBtn.addEventListener("click", () => {
    dialog.showModal();
});
closeInfoBtn.addEventListener('click', () => {
    infoDialog.close();
});
// Sulje nappi sulkee
closeBtn.addEventListener("click", () => {
    dialog.close();
});
// Ruoka dialogi
const modal = document.getElementById('dialog-menu');
if (!modal) {
    throw new Error('Modal not found');
}
//modaalissa klikkaus sulkee modaalin
modal.addEventListener('click', () => {
    modal.close();
});
// lasketaan etäisyys
const calculateDistance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
// luodaan html table ravintoloille - DAILY MENU
const createTable = (restaurants) => {
    const table = document.querySelector('table');
    if (!table) {
        return;
    }
    table.innerHTML = '';
    // jokaiselle ravintolalle oma rivi
    restaurants.forEach((restaurant) => {
        const { rivi, dailyMenuBtn, weeklyMenuBtn } = restaurantRow(restaurant);
        // lisätään rivit tableen
        table.appendChild(rivi);
        dailyMenuBtn.addEventListener('click', async () => {
            console.log("Click", restaurant);
            try {
                modal.innerHTML = '';
                // fetch DAILY menu
                const menu = await fetchData(apiUrl + `/restaurants/daily/${restaurant._id}/fi`);
                console.log(menu);
                const menuHtml = restaurantModal(restaurant, menu);
                modal.insertAdjacentHTML('beforeend', menuHtml);
                modal.showModal();
            }
            catch (error) {
                modal.innerHTML = errorModal(error.message);
                modal.showModal();
            }
        });
        weeklyMenuBtn.addEventListener('click', async () => {
            console.log("Click", restaurant);
            try {
                modal.innerHTML = '';
                // fetch WEEKLY menu
                const menu = await fetchData(apiUrl + `/restaurants/weekly/${restaurant._id}/fi`);
                console.log(menu);
                const menuHtml = weeklyModal(restaurant, menu);
                modal.insertAdjacentHTML('beforeend', menuHtml);
                modal.showModal();
            }
            catch (error) {
                modal.innerHTML = errorModal(error.message);
                modal.showModal();
            }
        });
    });
};
const error = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};
const success = async (pos) => {
    try {
        const crd = pos.coords;
        const restaurants = await fetchData(apiUrl + '/restaurants');
        console.log(restaurants);
        restaurants.sort((a, b) => {
            const x1 = crd.latitude;
            const y1 = crd.longitude;
            const x2a = a.location.coordinates[1];
            const y2a = a.location.coordinates[0];
            const distanceA = calculateDistance(x1, y1, x2a, y2a);
            const x2b = b.location.coordinates[1];
            const y2b = b.location.coordinates[0];
            const distanceB = calculateDistance(x1, y1, x2b, y2b);
            return distanceA - distanceB;
        });
        createTable(restaurants);
        //   // Set the Mapbox access token
        //   mapboxgl.accessToken = 'pk.eyJ1IjoiaGVucmllbGUiLCJhIjoiY20xb3EybGkxMGtqdzJpc2ZrYnQydWo1eiJ9.B8f9eFdPFgIQ6j8EV2VY3A';
        //   // Create the map instance
        //   const map = new mapboxgl.Map({
        //       container: 'map', // container ID (should match an element's ID in your HTML)
        //       style: 'mapbox://styles/mapbox/streets-v11', // Map style
        //       center: [-74.5, 40], // Starting position [lng, lat]
        //       zoom: 9 // Starting zoom level
        //   });
        //   // Lisää käyttäjän sijaintimerkki kartalle
        // new mapboxgl.Marker()
        // .setLngLat([crd.longitude, crd.latitude])
        // .addTo(map);
        // NAPIT
        const sodexoBtn = document.querySelector('#sodexo');
        const compassBtn = document.querySelector('#compass');
        const resetBtn = document.querySelector('#reset');
        // SODEXO
        if (!sodexoBtn) {
            console.log("Sodexo button missing in hötömölö");
            return;
        }
        sodexoBtn.addEventListener('click', () => {
            const sodexoRestaurants = restaurants.filter((restaurant) => restaurant.company === 'Sodexo');
            console.log(sodexoRestaurants);
            createTable(sodexoRestaurants);
        });
        // COMPASS
        if (!compassBtn) {
            console.log("Compass button missing in hötömölö");
            return;
        }
        compassBtn.addEventListener('click', () => {
            const compassRestaurants = restaurants.filter((restaurant) => restaurant.company === 'Compass Group');
            console.log(compassRestaurants);
            createTable(compassRestaurants);
        });
        // NÄYTÄ KAIKKI
        if (!resetBtn) {
            console.log("Reset button missing in hötömölö");
            return;
        }
        resetBtn.addEventListener('click', () => {
            createTable(restaurants);
        });
    }
    catch (error) {
        modal.innerHTML = errorModal(error.message);
        modal.showModal();
    }
};
navigator.geolocation.getCurrentPosition(success, error, positionOptions);
