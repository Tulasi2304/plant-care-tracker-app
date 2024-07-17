const plantsDisplay = document.getElementById("plantsList");
let userId = window.location.href.split('/')[4];
let plantsDB;
fetch(`http://localhost:3000/api/u/${userId}/plants-data`)
  .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
  .then((obj) => {
    plantsDB = obj.body;
    for (let i = 0; i < plantsDB.length; i++) {
      // console.log(plant);
      displayPlant(plantsDB[i], i);
    }
  });
class Plant{
  constructor(name, scientificName, location, planted, care, completed) {
    this.id = plantsDB?.length;
    this.name = name;
    this.scientificName = scientificName;
    this.location = location;
    this.planted = planted || new Date();
    this.image = `images/${getRandomImage()}`;
    this.careRoutines = care || [];
    this.completedTime = completed;
    this.growthTracking = {};
  }
}

function displayPlant(plant, index) {
  let { _id: id, name, scientificName: sciName, location: loc, image } = plant;
  let newPlant = document.createElement("div");
  newPlant.className = "col-lg-4 py-3 px-3";
  newPlant.id = `no-${id}`;
  let plantCard = document.createElement("div");
  plantCard.classList.add("plant-card");
  newPlant.appendChild(plantCard);
  let plantCardImg = document.createElement("div");
  plantCardImg.classList.add("plant-card-image");
  plantCardImg.innerHTML = `<img src="${image}" alt="plant-thumbnail">`;
  plantCard.appendChild(plantCardImg);
  let plantCardBody = document.createElement("div");
  plantCardBody.classList.add("plant-card-body");
  plantCardBody.innerHTML = `<p class="plant-name"><a href="#">${name}</a></p> 
                            <p class="card-body-text scientific-name">${sciName}</p> 
                            <p class="card-body-text location">Location: ${loc}</p>`;
  plantCard.appendChild(plantCardBody);
  let plantCardButtons = document.createElement("div");
  plantCardButtons.className = "flex card-buttons";
  let viewBtn = document.createElement("button");
  viewBtn.className = "btn btn-custom view-plant";
  viewBtn.setAttribute("data-bs-toggle", "modal");
  viewBtn.setAttribute("data-bs-target", "#plantDetailsModal");
  viewBtn.innerHTML = `<i class="fa-solid fa-eye"></i> View`;
  viewBtn.addEventListener("click", () => {
    viewPlant(index);
  });
  plantCardButtons.appendChild(viewBtn);
  let delBtn = document.createElement("a");
  delBtn.className = "btn btn-custom delete-plant";
  delBtn.innerHTML = `<i class="fa-solid fa-trash"></i> Delete`;
  delBtn.href = `/u/${userId}/plants/delete/${id}`;
  plantCardButtons.appendChild(delBtn);
  plantCard.appendChild(plantCardButtons);
  plantsDisplay.insertBefore(newPlant, plantsDisplay.children[index]);
}

function updatePlantDB(plant) {
  plantsDB.push(plant);
  localStorage.setItem("plantsDB", JSON.stringify(plantsDB));
  displayPlant(plant);
}

function addNewPlant(event) {
  event.preventDefault();
  let gaps = ["Minutes", "Hours", "Days", "Weeks"]
  const name = $("#name").val();
  const scientificName = $("#scientificName").val();
  const planted = $("#planted").val();
  const location = $("#location").val();
  const [type, freq, gap] = $("#watering").children();
  const care = [{
    type: type.value,
    frequency: freq.value,
    gap: gaps[gap.value],
  }];
  const completed = $('#completed').val();
  const ob = new Plant(name, scientificName, location, new Date(planted), care, completed);
  updatePlantDB(ob);
}

let options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour12: true,
  hour: "numeric",
  minute: "numeric",
  second: 'numeric',
};

function viewPlant(id) {
  // localStorage.setItem("currentPlant", JSON.stringify(plantsDB[id]));
  let currentPlant = plantsDB[id];
  $("#modalPlantName").html(
    `${currentPlant.name} <span class="italic">(${currentPlant.scientificName})</span>`
  );
  $("#curPlantImage").attr("src", currentPlant.image);
  $("#plantDetailsModal p span").text(new Date(currentPlant.planted).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }));

  $("#plantDetailsModal .routines .completed span").text(
    new Date(currentPlant.careRoutines[0].lastCompleted).toLocaleString("en-US", options)
  );
  $("#plantDetailsModal .routines .due span").text(
    new Date(currentPlant.careRoutines[0].nextDue).toLocaleString("en-US", options)
  );

}
