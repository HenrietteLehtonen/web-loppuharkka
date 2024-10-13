import {
  errorModal,
  restaurantModal,
  restaurantRow,
  weeklyModal,
} from "./components";
import { fetchData } from "./functions";
import { DailyMenu, WeeklyMenu } from "./types/Menu";
// import { Point } from './types/Point';
import { Restaurant } from "./types/Restaurant";
import { apiUrl, positionOptions } from "./variables";

const infoBtn = document.querySelector("#info-btn") as HTMLButtonElement;
const infoDialog = document.querySelector("#dialog-info") as HTMLDialogElement;
const closeInfoBtn = document.querySelector(
  "#info-btn-close"
) as HTMLButtonElement;
const dialog = document.querySelector(".dialog-login") as HTMLDialogElement;
const loginBtn = document.querySelector("#login-btn") as HTMLElement;
const closeBtn = document.querySelector("#close-btn") as HTMLElement;

// TOGLLE
const checkbox = document.getElementById("checkbox") as HTMLInputElement;
if (!checkbox) {
  console.error("Checkbox not found");
} else {
  console.log("Checkbox found");
}
// Toggle dark mode
function toggleDark() {
  console.log("toggle");
  document.documentElement.classList.toggle("dark");
}

// Checkbox change event
checkbox.addEventListener("change", () => {
  toggleDark(); // Kutsutaan funktiota kun checkboxin tila muuttuu
});

// INFO DIALOG
infoBtn.addEventListener("click", () => {
  console.log("click");
  infoDialog.showModal();
});

// LOGIN DIALOGI
// Login avaa dialogin
loginBtn.addEventListener("click", () => {
  dialog.showModal();
});
closeInfoBtn.addEventListener("click", () => {
  infoDialog.close();
});

// Sulje nappi sulkee
closeBtn.addEventListener("click", () => {
  dialog.close();
});

// Ruoka dialogi
const modal = document.getElementById("dialog-menu") as HTMLDialogElement;
if (!modal) {
  throw new Error("Modal not found");
}
//modaalissa klikkaus sulkee modaalin
modal.addEventListener("click", () => {
  modal.close();
});

// funktio jolla luodaan html table ravintoloille - DAILY MENU
const createTable = (restaurants: Restaurant[]) => {
  const table = document.querySelector("table");
  if (!table) {
    return;
  }
  table.innerHTML = "";

  // jokaiselle ravintolalle oma rivi
  restaurants.forEach((restaurant) => {
    const { rivi, dailyMenuBtn, weeklyMenuBtn } = restaurantRow(restaurant);
    // lisätään rivit tableen
    table.appendChild(rivi);

    dailyMenuBtn.addEventListener("click", async () => {
      console.log("Click", restaurant);
      try {
        modal.innerHTML = "";
        // fetch DAILY menu
        const menu = await fetchData<DailyMenu>(
          apiUrl + `/restaurants/daily/${restaurant._id}/fi`
        );
        console.log(menu);

        const menuHtml = restaurantModal(restaurant, menu);
        modal.insertAdjacentHTML("beforeend", menuHtml);

        modal.showModal();
      } catch (error) {
        modal.innerHTML = errorModal((error as Error).message);
        modal.showModal();
      }
    });

    weeklyMenuBtn.addEventListener("click", async () => {
      console.log("Click", restaurant);
      try {
        modal.innerHTML = "";
        // fetch WEEKLY menu
        const menu = await fetchData<WeeklyMenu>(
          apiUrl + `/restaurants/weekly/${restaurant._id}/fi`
        );
        console.log(menu);

        const menuHtml = weeklyModal(restaurant, menu);
        modal.insertAdjacentHTML("beforeend", menuHtml);

        modal.showModal();
      } catch (error) {
        modal.innerHTML = errorModal((error as Error).message);
        modal.showModal();
      }
    });
  });
};

// oma ja ravintolann etäisyys
const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const error = (err: GeolocationPositionError) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const success = async (pos: GeolocationPosition) => {
  try {
    const crd = pos.coords;
    const restaurants = await fetchData<Restaurant[]>(apiUrl + "/restaurants");
    console.log(restaurants);
    restaurants.sort((a: Restaurant, b: Restaurant) => {
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

    // NAPIT
    const sodexoBtn = document.querySelector("#sodexo") as HTMLButtonElement;
    const compassBtn = document.querySelector("#compass") as HTMLButtonElement;
    const resetBtn = document.querySelector("#reset") as HTMLButtonElement;

    // SODEXO
    if (!sodexoBtn) {
      console.log("Sodexo button missing in hötömölö");
      return;
    }

    sodexoBtn.addEventListener("click", () => {
      const sodexoRestaurants = restaurants.filter(
        (restaurant) => restaurant.company === "Sodexo"
      );
      console.log(sodexoRestaurants);
      createTable(sodexoRestaurants);
    });

    // COMPASS
    if (!compassBtn) {
      console.log("Compass button missing in hötömölö");
      return;
    }
    compassBtn.addEventListener("click", () => {
      const compassRestaurants = restaurants.filter(
        (restaurant) => restaurant.company === "Compass Group"
      );
      console.log(compassRestaurants);
      createTable(compassRestaurants);
    });

    // NÄYTÄ KAIKKI
    if (!resetBtn) {
      console.log("Reset button missing in hötömölö");
      return;
    }
    resetBtn.addEventListener("click", () => {
      createTable(restaurants);
    });
  } catch (error) {
    modal.innerHTML = errorModal((error as Error).message);
    modal.showModal();
  }
};

navigator.geolocation.getCurrentPosition(success, error, positionOptions);
