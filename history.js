// ==== Tab switching ====
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
        if (tab.dataset.tab === 'history') loadHistory();
      });
    });

    // ==== Doctor data ====
    const doctors = [
      { name: "Dr. Meena Sharma", specialty: "Cardiologist", hospital: "Apollo Hospital", experience: 12 },
      { name: "Dr. Rajesh Patel", specialty: "Neurologist", hospital: "Fortis Hospital", experience: 8 },
      { name: "Dr. Kavita Rao", specialty: "Dermatologist", hospital: "AIIMS", experience: 10 },
      { name: "Dr. Nikhil Joshi", specialty: "Pediatrician", hospital: "Max Healthcare", experience: 7 },
      { name: "Dr. Priya Deshmukh", specialty: "Orthopedic", hospital: "Narayana Health", experience: 9 },
      { name: "Dr. Sneha Bhosle", specialty: "Gynecologist", hospital: "Kokilaben Hospital", experience: 11 },
    ];

    const doctorList = document.getElementById('doctorList');
    doctors.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3 class="text-lg font-semibold text-cyan-600">${doc.name}</h3>
        <p>${doc.specialty}</p>
        <p>🏥 ${doc.hospital}</p>
        <p>💼 ${doc.experience} years experience</p>
        <div class="mt-3 flex flex-col gap-2">
          <input type="text" id="patientName_${doc.name}" placeholder="Enter patient name..." class="p-2 border rounded text-sm">
          <div class="flex gap-2">
            <button class="btn" onclick="startVideoCall('${doc.name}')">Video Call</button>
            <button class="btn bg-green-600 hover:bg-green-700" onclick="bookAppointment('${doc.name}')">Book Appointment</button>
          </div>
        </div>
      `;
      doctorList.appendChild(card);
    });

    // ==== Video call simulation ====
    function startVideoCall(doctorName) {
      const patientName = document.getElementById(`patientName_${doctorName}`).value.trim();
      if (!patientName) return alert("Please enter patient name before consultation.");
      alert(`Starting secure video consultation with ${doctorName} for ${patientName}...`);
      saveHistory({ patient: patientName, doctor: doctorName, type: 'Video Consultation', date: new Date().toLocaleString() });
    }

    // ==== Appointment booking ====
    function bookAppointment(doctorName) {
      const patientName = document.getElementById(`patientName_${doctorName}`).value.trim();
      if (!patientName) return alert("Please enter patient name before booking.");
      const date = prompt("Enter appointment date & time (e.g. 2025-10-10 10:00 AM)");
      if (date) {
        alert(`Appointment booked with ${doctorName} for ${patientName} on ${date}`);
        saveHistory({ patient: patientName, doctor: doctorName, type: 'Appointment', date });
      }
    }

    // ==== History System ====
    function saveHistory(data) {
      let history = JSON.parse(localStorage.getItem('consultationHistory')) || [];
      history.push(data);
      localStorage.setItem('consultationHistory', JSON.stringify(history));
    }

    function loadHistory(filterName = "") {
      const container = document.getElementById('historyList');
      container.innerHTML = '';
      const history = JSON.parse(localStorage.getItem('consultationHistory')) || [];
      if (history.length === 0) {
        container.innerHTML = "<p class='text-gray-500'>No consultation history found.</p>";
        return;
      }

      const filtered = filterName
        ? history.filter(h => h.patient.toLowerCase().includes(filterName.toLowerCase()))
        : history;

      if (filtered.length === 0) {
        container.innerHTML = "<p class='text-gray-500'>No matching patient history found.</p>";
        return;
      }

      filtered.reverse().forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <b>Patient:</b> ${item.patient}<br>
          <b>Doctor:</b> ${item.doctor}<br>
          <b>Type:</b> ${item.type}<br>
          <i>${item.date}</i>
        `;
        container.appendChild(div);
      });
    }

    document.getElementById('clearHistory').addEventListener('click', () => {
      localStorage.removeItem('consultationHistory');
      loadHistory();
    });

    // ==== Search by name ====
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
      loadHistory(e.target.value);
    });