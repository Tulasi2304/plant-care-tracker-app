/** Sample plant object:
{
  id: "string/number",
  name: "string",
  location: "string"
  scientificName: "string",
  image: "src path",
  planted: "date",
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
const addPlantForm = document.getElementById("addPlantForm");
addPlantForm.addEventListener("submit", addNewPlant);

// $("#addRoutine").click(addRoutine);

let plantsDB = JSON.parse(localStorage.getItem("plantsDB"));
if (plantsDB === undefined || plantsDB === null) {
  plantsDB = [
    {
      id: 0,
      name: "Rose",
      scientificName: "Rosa centifolia",
      location: "Terrace",
      image: "images/pexels-huy-phan-3076899.jpg",
      planted: "11/22/23",
      careRoutines: [
        {
          type: "Watering",
          frequency: 12,
          gap: "Hours",
        },
      ],
      completedTime: "08:10:01",
    },
    {
      id: 1,
      name: "Lilac",
      scientificName: "Syringa vulgaris",
      location: "Garden",
      image: "images/pexels-huy-phan-3153522.jpg",
      planted: "03/26/23",
      careRoutines: [
        {
          type: "Watering",
          frequency: 1,
          gap: "Days",
        },
      ],
      completedTime: "08:15:11",
    },
  ];
  localStorage.setItem("plantsDB", JSON.stringify(plantsDB));
}

for (let plant of plantsDB) {
  displayPlant(plant);
}

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

function displayPlant(plant) {
  let { id, name, scientificName: sciName, location: loc, image } = plant;
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
    viewPlant(id);
  });
  plantCardButtons.appendChild(viewBtn);
  let delBtn = document.createElement("button");
  delBtn.className = "btn btn-custom delete-plant";
  delBtn.innerHTML = `<i class="fa-solid fa-trash"></i> Delete`;
  delBtn.addEventListener("click", () => {
    deletePlant(id);
  });
  plantCardButtons.appendChild(delBtn);
  plantCard.appendChild(plantCardButtons);
  plantsDisplay.insertBefore(newPlant, plantsDisplay.children[id]);
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

// function addRoutine() {
//   let newRoutine = $("div").addClass("mb-3 input-group care-routine")
//     .html(`<input type="text" aria-label="Routine type" class="form-control" placeholder="Type">
//                 <input type="number" min="0" aria-label="Routine frequency" class="form-control" placeholder="Frequency">
//                 <select class="form-select" aria-label="Routine duration" >
//                   <option value="0">Hours</option>
//                   <option selected value="1">Days</option>
//                   <option value="2">Weeks</option>
//                   <option value="3">Months</option>
//                 </select>`);

// }

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

  const [completed, due] = calculateDue(currentPlant);

  $("#plantDetailsModal .routines .completed span").text(
    completed.toLocaleString("en-US", options)
  );
  $("#plantDetailsModal .routines .due span").text(new Date(due).toLocaleString("en-US", options));

}

function deletePlant(id) {
  $(`#no-${id}`).remove();
  plantsDB.splice(id, 1);
  localStorage.setItem("plantsDB", JSON.stringify(plantsDB));
}

calculateDue = (currentPlant) => {
  let timeToAdd = 0;
  let routine = currentPlant.careRoutines[0];
  switch (routine.gap) {
    case "Minutes": timeToAdd += routine.frequency * 60 * 1000;
      break;
    case "Hours": timeToAdd += routine.frequency * 3600 * 1000;
      break;
    case "Days": timeToAdd += routine.frequency * 24 * 3600 * 1000;
      break;
    case "Weeks": timeToAdd += routine.frequency * 7 * 24 * 3600 * 1000;
      break;
  }

  const [hours, minutes, seconds] = currentPlant.completedTime.split(':');
  let todayDate = new Date();
  let completed = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), hours, minutes, seconds);
  let due = completed.getTime() + timeToAdd;
  return [completed, due];
}

var audio = new Audio('audio/Alarm-Windows-10.mp3');
audio.loop = true;
dueDates = [];

for (let plant of plantsDB) {
  const [completed, due] = calculateDue(plant);
  dueDates.push(
    {
      id: plant.id, 
      due: new Date(due).toLocaleString("en-US", options)
    });
  console.log("ORIGINAL DUES ");
  console.log(dueDates[2]);
}

let presentLength = plantsDB.length;

setInterval(() => {
  if(plantsDB.length !== presentLength){
    location.reload();
    presentLength = plantsDB.length;
  }
  current = new Date().toLocaleString("en-US", options);
  if (due = dueDates.find(plant => plant.due === current)){
    playAlarm(due.id);
  }
  
  checkChangedDues();  

},1000);

playAlarm = async (id) => {
  await audio.play();
  setTimeout(function(){
    let plant = plantsDB.find(plant => plant.id === id);
    if(window.confirm("You have an alarm set for your \""+plant.name+"\" plant")){
      location.reload();
    }
  } ,1000);
  for (let plant of plantsDB) {
    if (plant.id === id) {
        plant.completedTime = convertTo24HourTime(new Date().toLocaleString("en-US", options));  //make this current time after changes
        console.log("COMPLETED "+plant.completedTime);
    }
  }
  localStorage.setItem("plantsDB", JSON.stringify(plantsDB));
}

checkChangedDues = () => {
  current = new Date().toLocaleString("en-US", options);
  changedDues = dueDates.find(plant => plant.due < current);
  if(changedDues){
    for (let date of dueDates) {
      if (date.id === changedDues.id) {
        fiveSecsAhead = new Date().getTime() + 5000;
        date.due = new Date(fiveSecsAhead).toLocaleString("en-US", options);
        console.log("CHANGED DUES ");
        console.log(dueDates[2]);
      }
    }
  }
}

function convertTo24HourTime(dateString) {
  const date = new Date(dateString);
  
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  };
  const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);
  return formattedTime;
}
