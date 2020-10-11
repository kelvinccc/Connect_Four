import "./styles.css";

document.getElementById("start-button").addEventListener("click", () => {
  console.log("clicked");
  transitionSequence();
});

function transitionSequence() {
  fadeOut();
  setTimeout(() => gameStart(), 1000);
}

function gameStart() {
  console.log("assets loaded");
  let mainContainer = document.getElementById("main-container");
  let startContainer = document.getElementById("start-container");
  let title = document.getElementById("title");
  document.getElementById("start-button").style.display = "none";
  startContainer.style.display = "block";
  startContainer.style.height = "auto";
  title.style.margin = "40px auto 30px auto";
  mainContainer.style.display = "flex";
  fadeIn();
}

function fadeOut() {
  console.log("fading-in");
  let transition = document.getElementById("transition");
  transition.style.zIndex = 1;
  transition.style.opacity = 1;
  return;
}

function fadeIn() {
  console.log("fading-out");
  let transition = document.getElementById("transition");
  transition.style.opacity = 0;
  setTimeout(() => {
    transition.style.zIndex = -1;
  }, 2000);
}
