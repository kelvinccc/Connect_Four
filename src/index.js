import "./styles.css";

document.getElementById("start-button").addEventListener("click", () => {
  let mainContainer = document.getElementById("main-container");
  let startContainer = document.getElementById("start-container");
  let title = document.getElementById("title");

  document.getElementById("start-button").style.display = "none";
  startContainer.style.display = "block";
  startContainer.style.height = "auto";
  title.style.margin = "40px auto 30px auto";
  mainContainer.style.display = "flex";
});
