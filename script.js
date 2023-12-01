/** Sample plant object:
{
  id: "string/number",
  name: "string",
  location: "string"
  scientificName: "string",
   plantedOn
  image: "src path",
    careRoutines: [
      {
        type: "",
        frequency: "",
        lastCompleted: "time/date",
        nextDue: "time/date"
      }
  ],
    growthTracking: {
    //metrics upto the user
      lastMeasured: "time/date"
  }
}
*/

const plantImages = [
  "pexels-cottonbro-studio-9707239.jpg",
  "pexels-huy-phan-3076899.jpg",
  "pexels-huy-phan-3153522.jpg",
  "pexels-huy-phan-3209811.jpg",
  "pexels-lisa-fotios-1982095.jpg",
];

  const getRandomImage = () => plantImages[Math.floor(Math.random() * 5)];

const addPlant = document.getElementById("addPlant");
const addPlantModal = document.getElementById("addPlantModal");
const plantsDisplay = document.getElementById("plantsList");
addPlant.addEventListener("click", displayForm);
let addPlantForm;

let plantsDB = JSON.parse(localStorage.getItem("plantsDB"));
if (plantsDB === undefined || plantsDB === null) {
  plantsDB = [
    {
      id: 0,
      name: "Rose",
      scientificName: "Rosa centifolia",
      location: "Terrace",
      image: "images/pexels-huy-phan-3076899.jpg",
    },
    {
      id: 1,
      name: "Rose",
      scientificName: "Rosa centifolia",
      location: "Terrace",
      image: "images/pexels-huy-phan-3153522.jpg",
    },
  ];
  localStorage.setItem("plantsDB", JSON.stringify(plantsDB));
}

for (let plant of plantsDB) {
  displayPlant(plant);
}

class Plant{
  constructor(name, scientificName, location) {
    this.id = plantsDB?.length;
    this.name = name;
    this.scientificName = scientificName;
    this.location = location;
    this.plantedOn = new Date();
    this.image = `images/${getRandomImage()}`;
    this.careRoutines = [];
    this.growthTracking = {};
  }
}

function displayPlant(plant) {
  
  let { id, name, scientificName: sciName, location: loc, image } = plant;
  let newPlant = document.createElement('div');
  newPlant.className = 'col-lg-4 py-3 px-3';
  let plantCard = document.createElement('div');
  plantCard.classList.add("plant-card");
  plantCard.id = `no-${id}`;
  newPlant.appendChild(plantCard);
  let plantCardImg = document.createElement('div');
  plantCardImg.classList.add("plant-card-image");
  plantCardImg.innerHTML = `<img src="${image}" alt="plant-thumbnail">`;
  plantCard.appendChild(plantCardImg);
  let plantCardBody = document.createElement('div');
  plantCardBody.classList.add("plant-card-body");
  plantCardBody.innerHTML =
    `<p class="plant-name"><a href="#">${name}</a></p> <p class="scientific-name">${sciName}</p> <p class="location">Location: ${loc}</p>`;
  plantCard.appendChild(plantCardBody);
  let plantCardButtons = document.createElement('div');
  plantCardButtons.className = "flex card-buttons";
  let viewBtn = document.createElement('button');
  viewBtn.className = "btn view-plant";
  viewBtn.innerHTML = `<i class="fa-solid fa-eye"></i> View`;
  viewBtn.addEventListener('click', () => { viewPlant(id) });
  plantCardButtons.appendChild(viewBtn);
  let delBtn = document.createElement('button');
  delBtn.className = "btn delete-plant";
  delBtn.innerHTML = `<i class="fa-solid fa-trash"></i> Delete`;
  delBtn.addEventListener("click", () => { deletePlant(id)});
  plantCardButtons.appendChild(delBtn);
  plantCard.appendChild(plantCardButtons);
  plantsDisplay.insertBefore(newPlant, plantsDisplay.children[id]);

}

function updatePlantDB(plant) {
  plantsDB.push(plant);
  // localStorage.setItem("plantsDB", JSON.stringify(plantsDB));
  displayPlant(plant);
}

function displayForm() {
  addPlantModal.style.display = "block";
  addPlantForm = document.getElementById('addPlantForm');
  addPlantForm.addEventListener('submit', addNewPlant);
}

function addNewPlant(event) {
  event.preventDefault();
  const name = $("#name").val();
  const scientificName = $("#scientificName").val();
  const location = $("#location").val();
  const ob = new Plant(name, scientificName, location);
  updatePlantDB(ob);
}

function viewPlant(id) {}

function deletePlant(id) {
  console.log(id);
  // localStorage.setItem("plantsDB", JSON.stringify(plantsDB));
  // plantsDisplay.remove($(`#no-${id}`));
}
