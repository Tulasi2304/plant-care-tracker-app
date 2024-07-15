const axios = require('axios');

const SERVICE_ID = "service_ivmllsg";
const TEMPLATE_ID = "water_template";
const USER_ID = "j5irwwvkQvhL3qNSt";

function sendReminder(toUser, toEmail, routine, plant) {
  const data = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: USER_ID,
    template_params: {
      to_email: toEmail,
      username: toUser,
      subject: 'Flora Tracker Reminder',
      message: `Routine ${routine} due for ${plant}`,
    },
  };

  axios
    .post("https://api.emailjs.com/api/v1.0/email/send", data, {
      headers: {
        origin: "http://localhost",
        ContentType: "application/json",
      },
    })
    .then((response) => {
      console.log("Email sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Failed to send email:", error.message);
    });
}

module.exports = sendReminder;