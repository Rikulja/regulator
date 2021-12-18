const axios = require("axios");
const timeLimit = 120; //⏲️ =================== You can configure the limit for how long it runs. This is in the seconds.
// If you set to zero, it will work forever :) and reactor will be happy, knowing that it never explodes.😊
//====================

//Fires up engine 🚀💥
const startEngine = async function () {
  const response = await axios.post(
    "https://warp-regulator-bd7q33crqa-lz.a.run.app/api/start",
    {
      name: "Tatjana Platonova",
      email: "platonova.tatjana92@gmail.com",
    }
  );
  console.log(`The mighty ${response.data.message}`);
  return response.data.authorizationCode;
};

//Get Status of the engine
const getStatus = async function (valueOfAuthorization) {
  const response = await axios.get(
    `https://warp-regulator-bd7q33crqa-lz.a.run.app/api/status?authorizationCode=${encodeURIComponent(
      valueOfAuthorization
    )}`
  );
  console.log(response.data);
  return response.data;
};

//sleep function to pause execution for a fixed amount of time.⏲️
const delay = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

//Adjust Matter and Antimatter
async function adjustMatter(authorizationCode, value) {
  await axios.post(
    "https://warp-regulator-bd7q33crqa-lz.a.run.app/api/adjust/matter",
    { authorizationCode: authorizationCode, value: value }
  );
}

async function adjustAntimatter(authorizationCode, value) {
  await axios.post(
    "https://warp-regulator-bd7q33crqa-lz.a.run.app/api/adjust/antimatter",
    { authorizationCode, value }
  );
}

const doAdjustments = async function (mat, anti, keycode) {
  await adjustMatter(keycode, mat);
  await adjustAntimatter(keycode, anti);
  console.log(`Adjusted Antimatter: ${anti} and Adjusted Matter: ${mat}`);
};

const calculateAdjustments = function (data) {
  const { flowRate, intermix } = data;

  const result = { matter: 0, antimatter: 0 };
  if (flowRate === "HIGH") {
    result.matter = -0.2;
    result.antimatter = -0.2;
  } else if (flowRate === "LOW") {
    result.matter = 0.2;
    result.antimatter = 0.2;
  } else if (intermix < 0.5) {
    result.matter = 0.2;
    result.antimatter = -0.2;
  } else if (intermix > 0.5) {
    result.matter = -0.2;
    result.antimatter = 0.2;
  }
  return result;
};

//All happens here 🔥
const runGame = async function () {
  const authorizationCode = await startEngine();

  const start = Date.now();

  for (;;) {
    const status = await getStatus(authorizationCode); // repeteadelty call get status. It will loop forever

    const { matter, antimatter } = calculateAdjustments(status);
    console.log({ matter, antimatter });
    await doAdjustments(matter, antimatter, authorizationCode);

    console.log(`Engine up time: ${formatTimer(Date.now() - start)}`);

    if (timeLimit > 0 && (Date.now() - start) / 1000 > timeLimit) {
      console.log("Hurray!!! It's working! 👏");
      break;
    }
    await delay(1000);
  }
};

const main = async function () {
  try {
    await runGame();
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log(err);
    }
  }
};

main();

// console.log(formatTimer(60 * 60 * 1000 * 2.5 + 5000));

function formatTimer(millis) {
  let time = millis / 1000;
  const hourNumber = Math.trunc(time / 60 / 60);
  const min = String(Math.trunc((time % (60 * 60)) / 60)).padStart(2, 0);
  const sec = String(Math.trunc(time % 60)).padStart(2, 0);
  const hour = String(hourNumber).padStart(2, 0);
  const ms = String(millis % 1000).padStart(3, 0);
  return `${hour}:${min}:${sec}.${ms}`;
}

//It was challenging and fun!🤓
