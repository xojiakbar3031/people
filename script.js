const people = [
  { id: 1, firstName: "Ali", age: 20, job: "Frontend Developer", location: "Tashkent" },
  { id: 2, studentName: "Jasur", age: 22, job: "Backend Developer", location: "Samarkand" },
  { id: 3, fullName: "Sardor", age: 19, job: "UI/UX Designer", location: "Bukhara" },
  { id: 4, userName: "Aziza", age: 21, job: "QA Engineer", location: "Andijan" },
  { id: 5, nickName: "Malika", age: 23, job: "Mobile Developer", location: "Namangan" },
  { id: 6, profileName: "Bekzod", age: 24, job: "DevOps Engineer", location: "Fergana" },
  { id: 7, personName: "Dilshod", age: 20, job: "Data Analyst", location: "Nukus" },
  { id: 8, displayName: "Madina", age: 22, job: "Project Manager", location: "Khiva" },
  { id: 9, accountName: "Sherzod", age: 25, job: "Cyber Security", location: "Jizzakh" },
  { id: 10, employeeName: "Shahzoda", age: 21, job: "Full Stack Developer", location: "Qarshi" }
];

// id, age, job, location'dan boshqa qolgan yagona key - bu ismning o'zi
// (har xil odamda ismning key nomi boshqacha: firstName, nickName, fullName va h.k.)
function getPersonName(person) {
  const knownKeys = ["id", "age", "job", "location"];
  const keys = Object.keys(person);

  for (let i = 0; i < keys.length; i++) {
    if (!knownKeys.includes(keys[i])) {
      return person[keys[i]];
    }
  }

  return "Noma'lum";
}

const cardsGrid = document.getElementById("cardsGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const jobFilter = document.getElementById("jobFilter");
const resetBtn = document.getElementById("resetBtn");
const resultCount = document.getElementById("resultCount");
const noResult = document.getElementById("noResult");

let likedIds = [];

// Filter select'ni kasblar bilan to'ldirish
function fillJobOptions() {
  const jobs = [...new Set(people.map(person => person.job))];

  for (let i = 0; i < jobs.length; i++) {
    const option = document.createElement("option");
    option.value = jobs[i];
    option.textContent = jobs[i];
    jobFilter.appendChild(option);
  }
}

// Bitta card uchun HTML matn yasash
function createCardHTML(person) {
  const isLiked = likedIds.includes(person.id);
  const name = getPersonName(person);
  const initial = name.charAt(0).toUpperCase();

  return `
    <div class="card-img">${initial}</div>
    <div class="card-info">
      <div class="card-top-row">
        <div>
          <div class="card-name">${name}</div>
          <div class="card-sub">${person.job}</div>
        </div>
        <span class="card-heart ${isLiked ? "liked" : ""}" data-id="${person.id}">${isLiked ? "❤️" : "🤍"}</span>
      </div>
      <div class="card-stats">
        <span>🎂 ${person.age} yosh</span>
        <span>📍 ${person.location}</span>
      </div>
    </div>
  `;
}

// Array'ni for loop bilan aylanib, DOM'ga card qilib chiqarish
function renderPeople(list) {
  cardsGrid.innerHTML = "";

  for (let i = 0; i < list.length; i++) {
    const person = list[i];

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = createCardHTML(person);

    cardsGrid.appendChild(card);
  }

  resultCount.textContent = `${list.length} ta odam topildi`;
  noResult.style.display = list.length === 0 ? "block" : "none";

  attachHeartEvents();
}

// Har bir card ichidagi yurak ikonkasiga event biriktirish
function attachHeartEvents() {
  const hearts = document.querySelectorAll(".card-heart");

  for (let i = 0; i < hearts.length; i++) {
    hearts[i].addEventListener("click", function () {
      const id = Number(this.dataset.id);

      if (likedIds.includes(id)) {
        likedIds = likedIds.filter(likedId => likedId !== id);
      } else {
        likedIds.push(id);
      }

      updateResults();
    });
  }
}

// Search + Filter + Sort birlashtirilgan natija
function updateResults() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedJob = jobFilter.value;
  const sortValue = sortSelect.value;

  let result = people.filter(person => {
    const name = getPersonName(person).toLowerCase();
    const matchesSearch = name.includes(searchValue);
    const matchesJob = selectedJob === "all" || person.job === selectedJob;
    return matchesSearch && matchesJob;
  });

  if (sortValue === "nameAsc") {
    result.sort((a, b) => getPersonName(a).localeCompare(getPersonName(b)));
  } else if (sortValue === "nameDesc") {
    result.sort((a, b) => getPersonName(b).localeCompare(getPersonName(a)));
  } else if (sortValue === "ageAsc") {
    result.sort((a, b) => a.age - b.age);
  } else if (sortValue === "ageDesc") {
    result.sort((a, b) => b.age - a.age);
  }

  renderPeople(result);
}

// Eventlar
searchInput.addEventListener("keyup", updateResults);
sortSelect.addEventListener("change", updateResults);
jobFilter.addEventListener("change", updateResults);

resetBtn.addEventListener("click", function () {
  searchInput.value = "";
  sortSelect.value = "default";
  jobFilter.value = "all";
  updateResults();
});

// Boshlang'ich yuklash
fillJobOptions();
updateResults();