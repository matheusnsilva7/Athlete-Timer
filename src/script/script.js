const restButton = document.querySelector("#rest");
const workoutButton = document.querySelector("#workout");

const resetRestButton = document.querySelector("#reset");
const resetWorkoutButton = document.querySelector("#main_reset");

const stopRestButton = document.querySelector("#stop");
const stopWorkoutButton = document.querySelector("#main_stop");

const restDisplay = document.querySelector(".timer");
const workoutDisplay = document.querySelector(".main_timer");

const InformationBox = document.querySelector(".information_box");

const addExerciseBtn = document.getElementById("addExercise");
const exerciseList = document.getElementById("exerciseList");

let restTimer = { intervalId: null, state: "stopped", minutes: 0, seconds: 0 };
let workoutTimer = {
  intervalId: null,
  state: "stopped",
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const formatTime = (h, m, s) =>
  `${h > 0 ? String(h).padStart(2, "0") + ":" : ""}${String(m).padStart(
    2,
    "0"
  )}:${String(s).padStart(2, "0")}`;

const updateRest = () => {
  restTimer.seconds++;
  if (restTimer.seconds >= 60) {
    restTimer.minutes++;
    restTimer.seconds = 0;
  }

  restDisplay.textContent = formatTime(0, restTimer.minutes, restTimer.seconds);

  if (restTimer.minutes >= 2) {
    stopRest();
    restTimer.minutes = 0;
    restTimer.seconds = 0;
    InformationBox.textContent = "Start Exercise";
  }
};

const updateWorkout = () => {
  workoutTimer.seconds++;
  if (workoutTimer.seconds >= 60) {
    workoutTimer.minutes++;
    workoutTimer.seconds = 0;
  }
  if (workoutTimer.minutes >= 60) {
    workoutTimer.hours++;
    workoutTimer.minutes = 0;
  }

  workoutDisplay.textContent = formatTime(
    workoutTimer.hours,
    workoutTimer.minutes,
    workoutTimer.seconds
  );
};

const startRest = () => {
  if (restTimer.intervalId) return;
  if (workoutTimer.state === "stopped") return;
  restTimer.intervalId = setInterval(updateRest, 1000);
  restTimer.state = "running";
  stopRestButton.textContent = "Stop";
  InformationBox.textContent = "Rest time";
};

const stopRest = () => {
  if (workoutTimer.state === "stopped") return;
  clearInterval(restTimer.intervalId);
  restTimer.intervalId = null;
  restTimer.state = "stopped";
  stopRestButton.textContent = "Start";
};

const resetRest = () => {
  stopRest();
  restTimer.minutes = restTimer.seconds = 0;
  restDisplay.textContent = "00:00";
  InformationBox.textContent = "Ready for Rest";
};

const startWorkout = () => {
  if (workoutTimer.intervalId) return;
  workoutTimer.intervalId = setInterval(updateWorkout, 1000);
  workoutTimer.state = "running";
  stopWorkoutButton.textContent = "Stop";
  InformationBox.textContent = "Workout time";
};

const stopWorkout = () => {
  clearInterval(workoutTimer.intervalId);
  stopRest();
  workoutTimer.intervalId = null;
  workoutTimer.state = "stopped";
  stopRestButton.textContent = "Stop";
  stopWorkoutButton.textContent = "Start";
};

const resetWorkout = () => {
  stopWorkout();
  workoutTimer.hours = workoutTimer.minutes = workoutTimer.seconds = 0;
  workoutDisplay.textContent = "00:00";
  InformationBox.textContent = "Ready for Workout";
};

const addExerciseHandler = () => {
  const name = document.getElementById("exerciseName").value.trim();
  const reps = document.getElementById("exerciseReps").value;
  const sets = document.getElementById("exerciseSets").value;

  if (!name || reps <= 0 || sets <= 0) {
    alert("Please enter valid exercise, reps, and sets.");
    return;
  }

  // Build checkboxes HTML
  let checkboxHTML = "";
  for (let i = 1; i <= sets; i++) {
    checkboxHTML += `<input type="checkbox" class="exercise-check">`;
  }

  // Add exercise to list
  exerciseList.innerHTML += `
    <li>
      <div class="exercise-info">${name} - ${reps} reps × ${sets} sets</div>
      <div class="sets">${checkboxHTML}</div>
    </li>
  `;

  // Select the last added list item
  const lastLi = exerciseList.lastElementChild;
  const info = lastLi.querySelector(".exercise-info");
  const checkboxes = lastLi.querySelectorAll(".exercise-check");

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const done = lastLi.querySelectorAll("input:checked").length;
      info.textContent = `${name} - ${reps} reps × ${sets - done} sets left`;
      console.log("Hey")
      if (done === parseInt(sets)) {
        lastLi.style.textDecoration = "line-through";
      } else {
        lastLi.style.textDecoration = "";
      }
    });
  });

  // Clear inputs
  document.getElementById("exerciseName").value = "";
  document.getElementById("exerciseReps").value = "";
  document.getElementById("exerciseSets").value = "";
};

restButton.addEventListener("click", startRest);
workoutButton.addEventListener("click", startWorkout);

stopRestButton.addEventListener("click", () =>
  restTimer.state === "running" ? stopRest() : startRest()
);
stopWorkoutButton.addEventListener("click", () =>
  workoutTimer.state === "running" ? stopWorkout() : startWorkout()
);

resetRestButton.addEventListener("click", resetRest);
resetWorkoutButton.addEventListener("click", resetWorkout);

addExerciseBtn.addEventListener("click", addExerciseHandler);
