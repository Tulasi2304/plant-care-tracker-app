const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressSession = require("express-session");
const connectMongo = require("connect-mongo");
const cron = require("cron");

const PORT = 3000
const HTML = __dirname + "/public/html/"
const utils = require("./utils.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Enabling Sessions
const User = require("./database/User.js");
const Plant = require("./database/Plant.js").model;
const CareRoutine = require("./database/CareRoutine.js").model;
const sendReminder = require("./notifications/service.js");

const mongoDBURL = `mongodb://localhost:27017/plantdb`;
app.use(
  expressSession({
    secret: "thisIsOurSecret",
    resave: false,
    saveUninitialized: false,
    store: connectMongo.create({
      mongoUrl: mongoDBURL,
    }),
  })
);

mongoose
  .connect(mongoDBURL)
  .then(() => console.log("Connected to Mongo."))
  .catch((err) => console.log(err.message));


app.get("/", (req, res) => {
  res.sendFile(`${HTML}index.html`);
})

app.get("/about", (req, res) => {
  res.sendFile(`${HTML}about.html`);
});

app.get("/contact", (req, res) => {
  res.sendFile(`${HTML}contact.html`);
});

app.get("/register", (req, res) => {
  res.sendFile(`${HTML}register.html`);
})
app.post("/register", (req, res) => {
  let { username, email, password, mobile } = req.body;
  // To Do: Validate user input
  User.create({ username, email, password, mobile })
    .then((registeredUser) => {
      req.session.userId = registeredUser._id;
      res.redirect(`/u/${registeredUser._id}/plants`);
    })
    .catch((err) => console.log(err.message));
})

app.get("/u/:uid/plants", (req, res) => {
  let plants;
  if ((req.session.userId == req.params.uid)) {
    function checkReminders() {
      console.log("Executing");
      User.findOne({ _id: req.session.userId }).then((user) => {
        plants = user.plants;
        routines = plants.map((p) => ({name: p.name, pid: p._id, routine: p.careRoutines[0]}));
        now = new Date();
        routines.forEach(({name, routine, pid}) => {
          if (routine.nextDue <= now) {
            console.log(`Reminder: Routine ${routine.type} due for ${name}`);
            sendReminder(user.username, user.email, routine.type, name);

            // Update nextDue date for the next reminder
            now = new Date();
            nowTime = [now.getHours(), now.getMinutes(), now.getSeconds()].join(':');
            updatedDue = utils.calculateDue(routine.gap, routine.frequency, nowTime);
            const plant = user.plants.id(pid);
            const careRoutine = plant.careRoutines.id(routine._id);
            careRoutine.nextDue = updatedDue;
            
            user.save().then((x) => console.log(`Next due successfully updated!`)).catch(err => console.log(err));
          }
        });
      });
      
    }

    // Check reminders every minute
    const timer = setInterval(checkReminders, 30000);

    res.sendFile(`${HTML}plants.html`);
  }
  else
    res.redirect("/register");
});

app.get("/api/u/:uid/plants-data", (req, res) => {
  let plants;
  User.findOne({ _id: req.session.userId })
    .then((user) => {
      plants = user.plants;
      res.json(plants);
    })
    .catch((err) => console.log(err.message));
})

app.get("/plants", (req, res) => {
  if (req.session.userId) res.redirect(`/u/${req.session.userId}/plants`);
  else res.redirect("/register");
});

app.post("/u/plants/add", (req, res) => {
  let { name, scientificName, planted, location, routine, frequency, gap, completed } = req.body;
  let gaps = ["Minutes", "Hours", "Days", "Weeks"];
  let lastCompleted = utils.buildDateTime(completed);
  let nextDue = utils.calculateDue(gaps[Number(gap)], frequency, completed);

  let careRoutine, plant;
  CareRoutine.create({ type: routine, frequency, gap: gaps[Number(gap)], lastCompleted, nextDue})
    .then((cr) => {
      careRoutine = cr;
      Plant.create({
        name,
        scientificName,
        location,
        planted,
        careRoutines: [careRoutine],
        image: utils.getRandomImage(),
      })
        .then((p) => {
          plant = p;
          User.updateOne(
            { _id: req.session.userId },
            { $push: { plants: plant } }
          )
            .then((ack) => {
              console.log(`Success!`);
              res.redirect(`/u/${req.session.userId}/plants`);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch(err => console.log(err));
 
});


app.get("/u/:uid/plants/delete/:pid", (req, res) => {
  User.updateOne(
    { _id: req.params.uid },
    {
      $pull: {
        plants: { _id: req.params.pid },
      },
    }
  )
    .then((ack) => {
      console.log(`Success!`);
      res.redirect(`/u/${req.session.userId}/plants`);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
