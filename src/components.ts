import { DailyMenu, WeeklyMenu } from "./types/Menu";
import { Restaurant } from "./types/Restaurant";

// HTML TAULUKON RIVIT
const restaurantRow = (restaurant: Restaurant) => {
  const { name, address, company } = restaurant;
  const rivi = document.createElement("tr");

  // nimi
  const nameCell = document.createElement("td");
  nameCell.innerText = name;

  // osoite
  const addressCell = document.createElement("td");
  addressCell.innerText = address;
  // company
  const companyCell = document.createElement("td");
  companyCell.innerText = company;

  // div napeille flexiä varten
  const buttonContainer = document.createElement("div");
  buttonContainer.setAttribute("id", "button-container");

  // napit
  const dailyMenuBtn = document.createElement("button");
  dailyMenuBtn.setAttribute("class", "show-menu-btn");
  dailyMenuBtn.innerText = "Daily Menu";

  const weeklyMenuBtn = document.createElement("button");
  weeklyMenuBtn.setAttribute("class", "show-menu-btn");
  weeklyMenuBtn.innerText = "Weekly Menu";

  // napit divin sisään
  buttonContainer.appendChild(dailyMenuBtn);
  buttonContainer.appendChild(weeklyMenuBtn);

  //  td nappidiville
  const buttonCell = document.createElement("td");
  buttonCell.appendChild(buttonContainer); // lisätään nappidiv solu-elementtiin

  // lisätään riville
  rivi.appendChild(nameCell);
  rivi.appendChild(addressCell);
  rivi.appendChild(companyCell);
  rivi.appendChild(buttonCell);

  // palautetaan rivit ja niiden buttonit -> voidaan hakea rivikohtaiset tiedot buttoneilla
  return { rivi, dailyMenuBtn, weeklyMenuBtn };
};

// LUODAAN RAFLA MODAALIIN SISÄLTÖ - DAILY MENU
const restaurantModal = (restaurant: Restaurant, menu: DailyMenu) => {
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
            <td>${diets ?? " - "}</td>
            <td>${price ?? " - "}</td>
          </tr>
          `;
  });
  html += "</table>";
  return html;
};

const errorModal = (message: string) => {
  const html = `
        <h3>Error</h3>
        <p>${message}</p>
        `;
  return html;
};

// WEEKLY MODAL
const weeklyModal = (restaurant: Restaurant, menu: WeeklyMenu) => {
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
          <td id=date-menu>${
            päivä === 0 ? date : ""
          }</td> <!-- päivämäärä ekalle riville --!>
          <td>${name}</td>
          <td>${diets ?? " - "}</td>
          <td>${price ?? " - "}</td>
        </tr>
      `;
    });
  });
  html += "</table>";
  return html;
};

export { restaurantRow, restaurantModal, weeklyModal, errorModal };
