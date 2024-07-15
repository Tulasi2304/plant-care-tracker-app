const calculateDue = (gap, frequency, completed) => {
  let timeToAdd = 0;
  switch (gap) {
    case "Minutes":
      timeToAdd += frequency * 60 * 1000;
      break;
    case "Hours":
      timeToAdd += frequency * 3600 * 1000;
      break;
    case "Days":
      timeToAdd += frequency * 24 * 3600 * 1000;
      break;
    case "Weeks":
      timeToAdd += frequency * 7 * 24 * 3600 * 1000;
      break;
  }

  const [hours, minutes, seconds] = completed.split(":");
  let todayDate = new Date();
  let completedDate = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate(),
    hours,
    minutes,
    seconds
  );
  let due = completedDate.getTime() + timeToAdd;
  console.log(
    new Date(due).toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
  );
  return due;
};

const buildDateTime = (time) => {
  let d = new Date();
  let [hours, minutes, seconds] = time.split(':');

  d.setHours(hours);
  d.setMinutes(minutes);
  d.setSeconds(seconds);

  return d;
}

const getRandomImage = () => {
  const plantImages = [
    "pexels-cottonbro-studio-9707239.jpg",
    "pexels-huy-phan-3076899.jpg",
    "pexels-huy-phan-3153522.jpg",
    "pexels-huy-phan-3209811.jpg",
    "pexels-lisa-fotios-1982095.jpg",
  ];
  return `/images/${plantImages[Math.floor(Math.random() * 5)]}`
};

module.exports = { calculateDue, buildDateTime, getRandomImage };