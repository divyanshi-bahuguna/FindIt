const API_URL = "http://localhost:5000/items";

async function fetchItems(search = "") {
  const res = await fetch(`${API_URL}?search=${encodeURIComponent(search)}`);
  const data = await res.json();
  displayItems(data);
}

function displayItems(items) {
  const container = document.getElementById("items");
  container.innerHTML = "";
  if (items.length === 0) {
    container.innerHTML = "<p>No items found 😔</p>";
    return;
  }
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      ${item.image ? `<img src="${item.image}" alt="${item.title}"/>` : ""}
      <div class="item-info">
        <h3>${item.title} ${item.type === "lost" ? "😢" : "😃"}</h3>
        <p>${item.description}</p>
        <p>📍 ${item.location}</p>
        <small>🗓 ${item.date}</small>
      </div>
    `;
    container.appendChild(card);
  });
}

document.getElementById("itemForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const location = document.getElementById("location").value;
  const type = document.getElementById("type").value;
  const image = document.getElementById("image").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, location, type, image }),
  });

  e.target.reset();
  fetchItems();
});

document.getElementById("search").addEventListener("input", (e) => {
  fetchItems(e.target.value);
});

fetchItems();
