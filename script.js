const itemForm = document.getElementById("itemForm");
const itemsDiv = document.getElementById("items");
const searchInput = document.getElementById("search");

const notifyUsers = []; // users who want notifications
const allItems = [];    // store all items

itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim().toLowerCase();
  const description = document.getElementById("description").value.trim();
  const location = document.getElementById("location").value.trim().toLowerCase();
  const type = document.getElementById("type").value;
  const notifyMe = document.getElementById("notifyMe").checked;
  const imageFile = document.getElementById("image").files[0];

  let imageURL = "";
  if (imageFile) {
    imageURL = await fileToBase64(imageFile);
  }

  const item = { title, description, location, type, imageURL };
  allItems.push(item);

  // Display the item
  displayItems(allItems);

  // Notify users if matching item exists
  notifyUsers.forEach(user => {
    if (user.title === title && user.type !== type) {
      showNotification(`📢 Matching item found: "${title}" (${type}) at ${location})`);
    }
  });

  // Add to notifyUsers list if checked
  if (notifyMe) {
    notifyUsers.push({ title, type });
  }

  itemForm.reset();
});

// Function to convert image file to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Function to display items
function displayItems(items) {
  itemsDiv.innerHTML = "";
  items.forEach(item => {
    const itemHTML = document.createElement("div");
    itemHTML.className = "item";
    itemHTML.innerHTML = `
      <div class="item-info">
        <h3>${item.title} (${item.type})</h3>
        <p>${item.description}</p>
        <p>📍 ${item.location}</p>
        ${item.imageURL ? `<img src="${item.imageURL}" alt="${item.title}" width="200"/>` : ""}
        ${item.imageURL ? `<button class="download-btn">Download Image</button>` : ""}
      </div>
    `;
    itemsDiv.appendChild(itemHTML);

    if (item.imageURL) {
      const downloadBtn = itemHTML.querySelector(".download-btn");
      downloadBtn.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = item.imageURL;
        a.download = item.title + ".png";
        a.click();
      });
    }
  });
}

// Optional: Search functionality
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = allItems.filter(item => 
    item.title.includes(query) || item.location.includes(query) || item.description.includes(query)
  );
  displayItems(filtered);
});

/* ===================== NOTIFICATIONS ===================== */
function showNotification(message) {
  const container = document.getElementById("notification-container");

  // Create notification element
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.textContent = message;
  container.appendChild(notif);

  // Remove after 5 seconds
  setTimeout(() => {
    notif.remove();
  }, 5000);
}
