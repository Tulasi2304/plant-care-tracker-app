const express = require("express");
const app = express();
const PORT = 3000
const HTML = __dirname + "/public/html/"

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${HTML}index.html`);
})

app.get("/about", (req, res) => {
  res.sendFile(`${HTML}about.html`);
});

app.get("/contact", (req, res) => {
  res.sendFile(`${HTML}contact.html`);
});

app.get("/plants", (req, res) => {
  res.sendFile(`${HTML}plants.html`);
});

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
