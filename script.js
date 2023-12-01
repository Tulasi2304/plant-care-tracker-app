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

const addPlant = document.getElementById("addPlant");
const addPlantModal = document.getElementById("addPlantModal");
const plantsDisplay = document.getElementById("plantsList");
addPlant.addEventListener("click", displayForm);
let addPlantForm;

let plantsDB = localStorage.getItem("plantsDB");
if (plantsDB === undefined || plantsDB === null) {
  plantsDB = [
    { id: 0, name: "Rose", scientificName: "Rosa centifolia", location: "Terrace" },
  ];
  // localStorage.setItem("plantsDB", plantsDB);
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
    this.image = "";
    this.careRoutines = [];
    this.growthTracking = {};
  }
}

const testPlant = {
  id: 1,
  name: "Lilac",
  scientificName: "Lilacus lilaceae",
  location: "Terrace"
}

function displayPlant(plant) {
  let { id, name, scientificName: sciName, location: loc } = plant;
  let newPlant = document.createElement('div');
  newPlant.className = 'col-lg-4 pb-3 px-2';
  let plantCard = document.createElement('div');
  plantCard.classList.add("plant-card");
  plantCard.id = `no-${id}`;
  newPlant.appendChild(plantCard);
  let plantCardImg = document.createElement('div');
  plantCardImg.classList.add("plant-card-image");
  plantCardImg.innerHTML = `<img src="${""}" alt="plant-thumbnail">`;
  plantCard.appendChild(plantCardImg);
  let plantCardBody = document.createElement('div');
  plantCardBody.classList.add("plant-card-body");
  plantCardBody.innerHTML =
    `<p class="plant-name"><a href="#">${name}</a></p> <p class="scientific-name">${sciName}</p>`;
  plantCard.appendChild(plantCardBody);
  let plantCardButtons = document.createElement('div');
  plantCardButtons.className = "flex card-buttons";
  let viewBtn = document.createElement('button');
  viewBtn.className = "btn view-plant";
  viewBtn.innerHTML = `View`;
  viewBtn.addEventListener('click', () => { viewPlant(id) });
  plantCardButtons.appendChild(viewBtn);
  let delBtn = document.createElement('button');
  delBtn.className = "btn delete-plant";
  delBtn.innerHTML = `Delete`;
  delBtn.addEventListener("click", () => { deletePlant(id)});
  plantCardButtons.appendChild(delBtn);
  plantCard.appendChild(plantCardButtons);
  plantsDisplay.insertBefore(newPlant, plantsDisplay.children[id]);

}

function updatePlantDB(plant) {
  plantsDB.push(plant);
  // localStorage.setItem("plantsDB", plantsDB);
  displayPlant(plant);
}

function displayForm() {
  addPlantModal.style.display = "block";
  addPlantForm = document.getElementById('addPlantForm');
  addPlantForm.addEventListener('submit', addNewPlant);
}

function addNewPlant(event) {
  event.preventDefault();
  //add plant to array, and update localStorage
  //const name = 
  addPlantModal.style.display = "none";
  updatePlantDB(testPlant);
}

function viewPlant(id) {}

function deletePlant(id) {}
