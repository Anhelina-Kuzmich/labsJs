// ==================== ЛАМПА ====================
const lampStates = new Map();
lampStates.set(1, false);
lampStates.set(2, false);
lampStates.set(3, false);

let currentLamp = 1;

const lampImg = document.getElementById("lampImg");
const lampContainer = document.getElementById("lampContainer");

function updateLampImage() {
  const isOn = lampStates.get(currentLamp);
  if (isOn === true) {
    lampImg.src = "../images/lamp" + currentLamp + "On.png";
    lampContainer.classList.add("lamp-on");
  } else {
    lampImg.src = "../images/lamp" + currentLamp + "Off.png";
    lampContainer.classList.remove("lamp-on");
  }
}

function selectLamp(lampNumber) {
  if (lampStates.has(lampNumber)) {
    currentLamp = lampNumber;
    lampStates.set(currentLamp, false);
    updateLampImage();
  }
}

function turnOn() {
  lampStates.set(currentLamp, true);
  updateLampImage();
  autoTurnOff();
}

function turnOff() {
  lampStates.set(currentLamp, false);
  updateLampImage();
}

function changeBrightness() {
  let brightnessLevel = Number(prompt("Напишіть рівень яскравості (0-5)"));
  const element = document.querySelector(".lampContainer");
  if (brightnessLevel >= 0 && brightnessLevel <= 5) {
    switch (brightnessLevel) {
      case 0:
        turnOff();
        break;
      case 1:
        turnOn();
        element.style.width = "200px";
        element.style.height = "200px";
        element.style.marginTop = "150px";
        element.style.marginBottom = "150px";
        break;
      case 2:
        turnOn();
        element.style.width = "250px";
        element.style.height = "250px";
        element.style.marginTop = "125px";
        element.style.marginBottom = "125px";
        break;
      case 3:
        turnOn();
        element.style.width = "300px";
        element.style.height = "300px";
        element.style.marginTop = "100px";
        element.style.marginBottom = "100px";
        break;
      case 4:
        turnOn();
        element.style.width = "400px";
        element.style.height = "400px";
        element.style.marginTop = "50px";
        element.style.marginBottom = "50px";
        break;
      case 5:
        turnOn();
        element.style.width = "500px";
        element.style.height = "500px";
        element.style.marginTop = "0px";
        element.style.marginBottom = "0px";
        break;
    }
  } else {
    alert("Неправильно введені дані. спробуйте ще");
  }
}

function autoTurnOff() {
  setTimeout(turnOff, 3000);
  console.log("Автовимкнення через бездіяльність");
}

// ==================== СВІТЛОФОР ====================
const trafficLightImg = document.getElementById("trafficLightImg");
const trafficLightStatusDiv = document.getElementById("trafficLightStatus");

let currentTLState = "off";
let autoCycleActive = false;
let autoTimer = null;
let blinkInterval = null;
let blinkCompleteCallback = null;

let timings = {
  red: 5000,
  yellow: 2000,
  green: 5000,
};

const BLINK_COUNT = 3;
const BLINK_INTERVAL = 500;

const colorSequence = ["red", "yellow", "green", "blinkingYellow"];

function updateTrafficLightImage() {
  if (currentTLState === "off") {
    trafficLightImg.src = "../images/trafficLightOff.png";
  } else if (currentTLState === "red") {
    trafficLightImg.src = "../images/trafficLightRedOn.png";
  } else if (currentTLState === "yellow") {
    trafficLightImg.src = "../images/trafficLightYellowOn.png";
  } else if (currentTLState === "green") {
    trafficLightImg.src = "../images/trafficLightGreenOn.png";
  }
}

function updateStatusText() {
  let text = "";
  switch (currentTLState) {
    case "off":
      text = "вимкнено";
      break;
    case "red":
      text = "червоний";
      break;
    case "yellow":
      text = "жовтий";
      break;
    case "green":
      text = "зелений";
      break;
    case "blinkingYellow":
      text = "жовтий миготливий";
      break;
    default:
      text = "";
  }
  trafficLightStatusDiv.textContent = text;
}

function stopAutoTimer() {
  if (autoTimer) {
    clearTimeout(autoTimer);
    autoTimer = null;
  }
}

function stopBlinking() {
  if (blinkInterval) {
    clearInterval(blinkInterval);
    blinkInterval = null;
  }
  if (currentTLState !== "off") {
    updateTrafficLightImage();
  }
  if (blinkCompleteCallback) {
    const callback = blinkCompleteCallback;
    blinkCompleteCallback = null;
    callback();
  }
}

function startBlinkingYellow(onComplete) {
  stopBlinking();
  let blinkCount = 0;
  let isOn = true;

  function toggle() {
    if (blinkCount >= BLINK_COUNT * 2) {
      stopBlinking();
      if (onComplete) onComplete();
      return;
    }
    if (isOn) {
      trafficLightImg.src = "../images/trafficLightYellowOn.png";
    } else {
      trafficLightImg.src = "../images/trafficLightOff.png";
    }
    isOn = !isOn;
    blinkCount++;
  }

  toggle();
  blinkInterval = setInterval(toggle, BLINK_INTERVAL);
}

function stopAllTimers() {
  stopAutoTimer();
  stopBlinking();
}

function transitionTo(newState, fromAuto = false) {
  if (newState === currentTLState) return;

  stopAllTimers();
  currentTLState = newState;

  if (currentTLState === "blinkingYellow") {
    updateStatusText();
    if (fromAuto) {
      startBlinkingYellow(() => {
        if (autoCycleActive && currentTLState === "blinkingYellow") {
          transitionTo("red", true);
        }
      });
    } else {
      startBlinkingYellow(null);
    }
  } else {
    updateTrafficLightImage();
    updateStatusText();
    if (autoCycleActive && currentTLState !== "off") {
      scheduleNextTransition();
    }
  }
}

function scheduleNextTransition() {
  if (!autoCycleActive) return;
  stopAutoTimer();

  let delay = 0;
  if (currentTLState === "red") delay = timings.red;
  else if (currentTLState === "yellow") delay = timings.yellow;
  else if (currentTLState === "green") delay = timings.green;
  else return;

  autoTimer = setTimeout(() => {
    if (!autoCycleActive) return;
    let currentIndex = colorSequence.indexOf(currentTLState);
    let nextIndex = (currentIndex + 1) % colorSequence.length;
    let nextState = colorSequence[nextIndex];
    transitionTo(nextState, true);
  }, delay);
}

function startTrafficLightAutoCycle() {
  if (autoCycleActive) {
    stopAllTimers();
    autoCycleActive = true;
    transitionTo("red", true);
  } else {
    autoCycleActive = true;
    transitionTo("red", true);
  }
}

function stopTrafficLight() {
  autoCycleActive = false;
  stopAllTimers();
  currentTLState = "off";
  updateTrafficLightImage();
  updateStatusText();
}

function nextTrafficLightState() {
  autoCycleActive = false;
  stopAllTimers();

  if (currentTLState === "off") {
    transitionTo("red", false);
    return;
  }

  let currentIndex = colorSequence.indexOf(currentTLState);
  if (currentIndex === -1) {
    transitionTo("red", false);
    return;
  }
  let nextIndex = (currentIndex + 1) % colorSequence.length;
  let nextState = colorSequence[nextIndex];
  transitionTo(nextState, false);
}

function changeTrafficLightTimings() {
  let newRed = prompt("Введіть час для червоного:", timings.red / 1000);
  let newYellow = prompt("Введіть час для жовтого:", timings.yellow / 1000);
  let newGreen = prompt("Введіть час для зеленого:", timings.green / 1000);

  let redSec = parseFloat(newRed);
  let yellowSec = parseFloat(newYellow);
  let greenSec = parseFloat(newGreen);

  if (
    isNaN(redSec) ||
    isNaN(yellowSec) ||
    isNaN(greenSec) ||
    redSec <= 0 ||
    yellowSec <= 0 ||
    greenSec <= 0
  ) {
    alert("Помилка: час має бути додатним числом.");
    return;
  }

  timings.red = redSec * 1000;
  timings.yellow = yellowSec * 1000;
  timings.green = greenSec * 1000;

  alert(
    "Часи оновлено: червоний " +
      redSec +
      "с, жовтий " +
      yellowSec +
      "с, зелений " +
      greenSec +
      "с"
  );

  if (
    autoCycleActive &&
    currentTLState !== "off" &&
    currentTLState !== "blinkingYellow"
  ) {
    stopAutoTimer();
    scheduleNextTransition();
  }
}

updateTrafficLightImage();
updateStatusText();

// ==================== ЦИФРОВИЙ ГОДИННИК ====================
const hourImg1 = document.getElementById("hourImg1");
const hourImg2 = document.getElementById("hourImg2");
const minuteImg1 = document.getElementById("minuteImg1");
const minuteImg2 = document.getElementById("minuteImg2");
const secondImg1 = document.getElementById("secondImg1");
const secondImg2 = document.getElementById("secondImg2");

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  hourImg1.src = `../images/${Math.floor(hours / 10)}.png`;
  hourImg2.src = `../images/${hours % 10}.png`;
  minuteImg1.src = `../images/${Math.floor(minutes / 10)}.png`;
  minuteImg2.src = `../images/${minutes % 10}.png`;
  secondImg1.src = `../images/${Math.floor(seconds / 10)}.png`;
  secondImg2.src = `../images/${seconds % 10}.png`;
}

updateClock();
setInterval(updateClock, 1000);

// ==================== МИГОТЛИВИЙ ІНДИКАТОР СЕКУНД ====================
const secondsContainer = document.querySelector(".secoundsContainer");
if (secondsContainer) secondsContainer.classList.add("blink");

// ==================== ТАЙМЕР ЗВОРОТНОГО ВІДЛІКУ ====================
let countdownInterval = null;
let targetDate = null;

function updateCountdown() {
  if (!targetDate) return;
  const now = new Date();
  const diffMs = targetDate - now;

  if (diffMs <= 0) {
    clearInterval(countdownInterval);
    countdownInterval = null;
    document.getElementById("countdownDays").innerText = "0";
    document.getElementById("countdownHours").innerText = "00";
    document.getElementById("countdownMinutes").innerText = "00";
    document.getElementById("countdownSeconds").innerText = "00";
    alert("Час вийшов!");
    targetDate = null;
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("countdownDays").innerText = days;
  document.getElementById("countdownHours").innerText = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("countdownMinutes").innerText = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("countdownSeconds").innerText = seconds
    .toString()
    .padStart(2, "0");
}

function startCountdown() {
  const inputElem = document.getElementById("countdownTarget");
  let inputValue = inputElem.value;
  if (!inputValue) {
    inputValue = prompt(
      "Введіть дату та час у форматі YYYY-MM-DDTHH:MM",
      "2025-12-31T23:59"
    );
    if (!inputValue) return;
  }
  const newTarget = new Date(inputValue);
  if (isNaN(newTarget.getTime())) {
    alert("Неправильний формат дати. Використовуйте YYYY-MM-DDTHH:MM");
    return;
  }
  if (newTarget <= new Date()) {
    alert("Дата має бути в майбутньому!");
    return;
  }
  targetDate = newTarget;
  if (countdownInterval) clearInterval(countdownInterval);
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

// ==================== КАЛЕНДАР ====================
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let birthday = null;

const monthPicker = document.getElementById("monthPicker");
const calendarDiv = document.getElementById("calendar");
const birthdayResult = document.getElementById("birthdayResult");

monthPicker.addEventListener("change", function () {
  const [year, month] = monthPicker.value.split("-");
  currentYear = parseInt(year);
  currentMonth = parseInt(month) - 1;
  renderCalendar();
});

function renderCalendar() {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  calendarDiv.innerHTML = "";

  let offset = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < offset; i++) {
    let day = prevMonthDays - offset + i + 1;
    let cell = document.createElement("div");
    cell.textContent = day;
    cell.classList.add("calendar-day", "other-month");
    calendarDiv.appendChild(cell);
  }

  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    let cell = document.createElement("div");
    cell.textContent = day;
    cell.classList.add("calendar-day");

    if (
      currentYear === today.getFullYear() &&
      currentMonth === today.getMonth() &&
      day === today.getDate()
    ) {
      cell.classList.add("today");
    }
    if (birthday && birthday.month === currentMonth && birthday.day === day) {
      cell.classList.add("birthday");
    }
    cell.addEventListener("click", () =>
      setBirthday(currentYear, currentMonth, day)
    );
    calendarDiv.appendChild(cell);
  }
}

function setBirthday(year, month, day) {
  birthday = { year, month, day };
  renderCalendar();
  updateBirthdayCountdown();
}

function updateBirthdayCountdown() {
  if (!birthday) {
    birthdayResult.textContent = "День народження не обрано";
    return;
  }
  const now = new Date();
  let nextBirthday = new Date(now.getFullYear(), birthday.month, birthday.day);
  if (nextBirthday <= now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }
  const diffMs = nextBirthday - now;
  if (diffMs <= 0) {
    birthdayResult.textContent = "Сьогодні день народження! 🎉";
    return;
  }

  const MS_IN_DAY = 1000 * 60 * 60 * 24;
  const MS_IN_HOUR = 1000 * 60 * 60;
  const MS_IN_MINUTE = 1000 * 60;

  let months = 0;
  let tempDate = new Date(now);
  while (true) {
    let next = new Date(tempDate);
    next.setMonth(next.getMonth() + 1);
    if (next > nextBirthday) break;
    tempDate = next;
    months++;
  }

  const remainingMs = nextBirthday - tempDate;

  const days = Math.floor(remainingMs / MS_IN_DAY);
  const hours = Math.floor((diffMs % MS_IN_DAY) / MS_IN_HOUR);
  const minutes = Math.floor((diffMs % MS_IN_HOUR) / MS_IN_MINUTE);
  const seconds = Math.floor((diffMs % MS_IN_MINUTE) / 1000);

  birthdayResult.innerHTML = `Наступне свято через ${months} міс. ${days} дн. ${hours} год. ${minutes} хв. ${seconds} сек.`;
}

monthPicker.value = `${currentYear}-${String(currentMonth + 1).padStart(
  2,
  "0"
)}`;
renderCalendar();
updateBirthdayCountdown();
