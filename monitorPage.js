const axios = require("axios");
const sendMail = require("./mailer");

const STOP_DATE = new Date("2025-12-21T00:00:00");
const url = "https://rte25.upsdc.gov.in/StudentLogin.aspx";

function checkStopDate() {
  const now = new Date();
  if (now >= STOP_DATE) {
    console.log("Monitoring stopped: Date passed 20 Dec 2025.");
    process.exit(0);
  }
}

async function monitor() {
  checkStopDate();

  try {
    const response = await axios.get(url, { maxRedirects: 0 });

    const status = response.status;
    const hasMessage = response.data.includes("ProcessClosedOpenShortly");

    if (status !== 302 || hasMessage) {
      let msg = `ALERT!
Status: ${status}
ProcessClosedOpenShortly Found: ${hasMessage}`;

      console.log("Sending alert email...");
      await sendMail("UPSDC ALERT", msg);
    } else {
      console.log("OK: Status 302 and message found.");
    }

  } catch (err) {
    let status = err.response ? err.response.status : "NO_RESPONSE";
    let hasMessage =
      err.response && err.response.data && err.response.data.includes("ProcessClosedOpenShortly");

    let msg = `ERROR calling URL!
Status: ${status}
MessageFound: ${hasMessage}`;

    console.log("Sending error alert email...");
    await sendMail("UPSDC ERROR", msg);
  }
}

monitor();
