function showTab(tabId) {
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    }

    // Blood Donation Camps
    const campForm = document.getElementById('campForm');
    const campList = document.getElementById('campList');
    const existingCamps = document.getElementById('existingCamps');
    let camps = [];

    campForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const camp = {
        name: document.getElementById('campName').value,
        location: document.getElementById('location').value,
        date: document.getElementById('date').value,
        organizer: document.getElementById('organizer').value
      };
      camps.push(camp);
      updateCampDisplay();
      campForm.reset();
      showTab('home');
    });

    function updateCampDisplay() {
      let listHTML = camps.map(c => `<p><b>${c.name}</b> — ${c.location} (${c.date}) [Organizer: ${c.organizer}]</p>`).join('');
      campList.innerHTML = listHTML || "No camps added yet.";
      existingCamps.innerHTML = listHTML || "No camps added yet.";
    }

    // Inventory
    const inventoryForm = document.getElementById('inventoryForm');
    const inventoryList = document.getElementById('inventoryList');
    const existingInventory = document.getElementById('existingInventory');
    let inventory = [];

    inventoryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const entry = {
        hospital: document.getElementById('hospitalName').value,
        bloodType: document.getElementById('bloodType').value,
        quantity: document.getElementById('quantity').value
      };
      inventory.push(entry);
      updateInventoryDisplay();
      inventoryForm.reset();
      showTab('home');
    });

    function updateInventoryDisplay() {
      let listHTML = inventory.map(i => `<p><b>${i.bloodType}</b> — ${i.quantity} units at ${i.hospital}</p>`).join('');
      inventoryList.innerHTML = listHTML || "No inventory added yet.";
      existingInventory.innerHTML = listHTML || "No inventory added yet.";
    }
  