const harcamaInput = document.querySelector("#harcama");
const fiyatInput = document.querySelector("#fiyat");
const statusCheck = document.querySelector("#status-input");
const formButton = document.querySelector(".ekle-btn");
const liste = document.querySelector(".liste");
const toplamBilgi = document.querySelector("#toplam-bilgi");
const selectFilter = document.querySelector("#filter-select");
const nameInput = document.querySelector("#name-input");
const searchBtn = document.querySelector("#search-button");

document.addEventListener("DOMContentLoaded", showExpenses);

function showExpenses() {
  const username = nameInput.value.trim();
  if (!username) {
    return;
  }

  const storageKey = `${username}_expenses`;
  const existingExpenses = JSON.parse(localStorage.getItem(storageKey)) || [];

  // Toplamı sıfırla
  toplam = 0;
  toplamBilgi.innerText = toplam;

  // Listeyi temizle
  liste.innerHTML = "";

  existingExpenses.forEach((expense) => {
    const harcamaDiv = document.createElement("div");
    harcamaDiv.classList.add("harcama");
    if (expense.payed) {
      harcamaDiv.classList.add("payed");
    }
    harcamaDiv.innerHTML = `
      <h2>${expense.harcama}</h2>
      <h2 id="value">${expense.fiyat}</h2>
      <div class="buttons">
          <img id="payment" src="assets/pay.png" alt="">
          <img id="remove" src="assets/remove.png" alt="">
      </div>
    `;
    liste.appendChild(harcamaDiv);
    // Toplamı güncelle
    updateToplam(expense.fiyat);
  });

  selectFilter.value = "all";
}
//localStorage.getItem("name") ||
const username = "";

nameInput.value = username;

nameInput.addEventListener("input", (e) => {
  localStorage.setItem("name", e.target.value);

  liste.innerText = "";
  toplamBilgi.innerText = 0;
  toplam = 0;
});

formButton.addEventListener("click", addExpense);

liste.addEventListener("click", handleClick);

selectFilter.addEventListener("change", handleFilter);

searchBtn.addEventListener("click", () => {
  showExpenses();
});

// toplam state i (durum)
let toplam = 0;
toplamBilgi.innerText = toplam;

function updateToplam(fiyat) {
  toplam += Number(fiyat);
  toplamBilgi.innerText = toplam;
}

function addExpense(e) {
  e.preventDefault();

  const username = nameInput.value.trim();

  if (!username || !harcamaInput.value || !fiyatInput.value) {
    alert("Lütfen bütün alanları doldurunuz");
    return;
  }

  const storageKey = `${username}_expenses`;
  const existingExpenses = JSON.parse(localStorage.getItem(storageKey)) || [];

  const newExpense = {
    harcama: harcamaInput.value,
    fiyat: fiyatInput.value,
    payed: statusCheck.checked,
  };

  existingExpenses.push(newExpense);
  localStorage.setItem(storageKey, JSON.stringify(existingExpenses));

  //div oluşturma
  const harcamaDiv = document.createElement("div");

  harcamaDiv.classList.add("harcama");

  if (statusCheck.checked) {
    harcamaDiv.classList.add("payed");
  }

  harcamaDiv.innerHTML = `
    <h2>${harcamaInput.value}</h2>
    <h2 id="value">${fiyatInput.value}</h2>
    <div class="buttons">
        <img id="payment" src="assets/pay.png" alt="">
        <img id="remove" src="assets/remove.png" alt="">
    </div>
  `;

  liste.appendChild(harcamaDiv);

  updateToplam(fiyatInput.value);

  harcamaInput.value = "";
  fiyatInput.value = "";
}

function handleClick(e) {
  const element = e.target;
  if (element.id === "remove") {
    const wrapperElement = element.parentElement.parentElement;
    const deletedHarcama = wrapperElement.querySelector("h2").innerText;
    const deletedPrice = wrapperElement.querySelector("#value").innerText;

    //

    // Local storage'dan silme işlemi
    const username = nameInput.value.trim();
    const storageKey = `${username}_expenses`;
    let existingExpenses = JSON.parse(localStorage.getItem(storageKey)) || [];

    // Silinen harcamayı bul ve diziden çıkar
    existingExpenses = existingExpenses.filter((expense) => {
      return (
        expense.harcama !== deletedHarcama || expense.fiyat !== deletedPrice
      );
    });

    console.log(existingExpenses);

    localStorage.setItem(storageKey, JSON.stringify(existingExpenses));

    //

    updateToplam(-Number(deletedPrice));

    wrapperElement.remove();
  }
}

function handleFilter(e) {
  const items = Array.from(liste.children);
  const filterValue = e.target.value;

  toplam = 0;
  toplamBilgi.innerText = toplam;

  items.forEach((item) => {
    const isPayed = item.classList.contains("payed");
    const itemFiyat = Number(item.querySelector("#value").innerText);
    switch (filterValue) {
      case "all":
        item.style.display = "flex";
        updateToplam(itemFiyat);
        break;

      case "payed":
        if (!isPayed) {
          item.style.display = "none";
        } else {
          item.style.display = "flex";
          updateToplam(itemFiyat);
        }
        break;

      case "not-payed":
        if (isPayed) {
          item.style.display = "none";
        } else {
          item.style.display = "flex";
          updateToplam(itemFiyat);
        }
        break;
    }
  });
}
