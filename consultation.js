/* ---------------------------
   Sample data: doctors + hospitals
--------------------------- */
const DOCTORS = [
  { id: 'd1', name: 'Dr. Aditi Patil', specialty: 'General Physician', exp: 6, hospital: 'D.Y. Patil Hospital', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', mobile: '9000000001', lat: 16.704, lng: 74.241 },
  { id: 'd2', name: 'Dr. Rohit Deshmukh', specialty: 'Cardiologist', exp: 10, hospital: 'City Heart Center', avatar: 'https://randomuser.me/api/portraits/men/43.jpg', mobile: '9000000002', lat: 16.706, lng: 74.237 },
  { id: 'd3', name: 'Dr. Sneha Kulkarni', specialty: 'Pediatrician', exp: 7, hospital: 'Smile Kids Hospital', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', mobile: '9000000003', lat: 16.702, lng: 74.240 },
  { id: 'd4', name: 'Dr. Mohan Rao', specialty: 'Orthopedics', exp: 12, hospital: 'OrthoPlus Clinic', avatar: 'https://randomuser.me/api/portraits/men/37.jpg', mobile: '9000000004', lat: 16.705, lng: 74.238 },
];

const HOSPITALS = [
  { id: 'h1', name: 'D.Y. Patil Hospital', address: 'Kadamvadi, Kolhapur', phone: '0231-123456', lat:16.704, lng:74.241 },
  { id: 'h2', name: 'City Heart Center', address: 'Station Road', phone: '0231-987654', lat:16.706, lng:74.237 },
];

/* ---------------------------
   DOM Elements
--------------------------- */
const doctorsListEl = document.getElementById('doctorsList');
const hospitalsListEl = document.getElementById('hospitalsList');
const filterSpecialty = document.getElementById('filterSpecialty');
const selectedCard = document.getElementById('selectedCard');
const selAvatar = document.getElementById('selAvatar');
const selName = document.getElementById('selName');
const selSpec = document.getElementById('selSpec');
const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChat');
const locationMapTab = document.getElementById('locationMapTab');

/* ---------------------------
   Populate Specialties
--------------------------- */
function populateSpecialties() {
  const set = new Set(DOCTORS.map(d => d.specialty));
  set.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    filterSpecialty.appendChild(opt);
  });
}

/* ---------------------------
   Render Doctors + Hospitals
--------------------------- */
function renderDoctors(filter='') {
  doctorsListEl.innerHTML = '';
  const filtered = filter ? DOCTORS.filter(d => d.specialty===filter) : DOCTORS;
  filtered.forEach(d => {
    const card = document.createElement('div');
    card.className = 'doctor-card bg-white rounded-xl p-4 flex gap-4 items-start';
    card.innerHTML = `
      <img src="${d.avatar}" class="w-20 h-20 rounded-lg object-cover shadow-sm" alt="">
      <div class="flex-1">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="font-semibold text-lg">${d.name}</div>
            <div class="text-sm text-slate-500">${d.specialty} • ${d.exp} yrs</div>
            <div class="text-sm text-slate-400 mt-1">${d.hospital}</div>
          </div>
          <div class="text-right">
            <button class="px-2 py-1 bg-cyan-600 text-white rounded-md mr-2 btn-consult" data-id="${d.id}">Consult</button>
            <button class="px-2 py-1 bg-slate-200 rounded-md text-slate-700 btn-book" data-id="${d.id}">Book</button>
          </div>
        </div>
      </div>
    `;
    doctorsListEl.appendChild(card);
  });
}

function renderHospitals() {
  hospitalsListEl.innerHTML = '';
  HOSPITALS.forEach(h => {
    const el = document.createElement('div');
    el.className = 'bg-white p-3 rounded-lg flex gap-3 items-start';
    el.innerHTML = `<div class="flex-1">
      <div class="font-semibold">${h.name}</div>
      <div class="text-sm text-slate-500">${h.address}</div>
      <div class="text-sm text-slate-400 mt-1">Tel: ${h.phone}</div>
    </div>`;
    hospitalsListEl.appendChild(el);
  });
}

/* ---------------------------
   Select Doctor
--------------------------- */
let SELECTED_DOCTOR = null;
function selectDoctor(id) {
  const doc = DOCTORS.find(d => d.id===id);
  if (!doc) return;
  SELECTED_DOCTOR = doc;
  selAvatar.src = doc.avatar;
  selName.textContent = doc.name;
  selSpec.textContent = `${doc.specialty} • ${doc.hospital}`;
  selectedCard.classList.remove('hidden');
  selectedCard.scrollIntoView({behavior:'smooth', block:'center'});
}

/* ---------------------------
   Chatbot with Detailed Advice
--------------------------- */
function appendMessage(text, who='ai') {
  const el = document.createElement('div');
  el.className = `p-3 rounded-md ${who==='ai' ? 'msg-ai' : 'msg-user'} shadow-sm text-sm`;
  el.innerHTML = text;
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getDetailedAdvice(symptom){
  const s = symptom.toLowerCase();
  if(s.includes('fever')) return {
    advice:'You may have an infection. Monitor temperature, rest well, stay hydrated, and eat light meals.',
    meds:'Paracetamol, Ibuprofen. Consult doctor if fever > 102°F or lasts >3 days.'
  };
  if(s.includes('headache')) return {
    advice:'Could be tension or migraine. Rest in dark room, stay hydrated, avoid screen time.',
    meds:'Paracetamol, Aspirin. Seek medical attention if pain is severe or persistent.'
  };
  if(s.includes('cold')) return {
    advice:'Likely viral. Drink warm fluids, rest, and avoid cold exposure.',
    meds:'Cetirizine, Paracetamol. See doctor if symptoms worsen or persist >5 days.'
  };
  return {
    advice:'Symptoms unclear. Rest, hydrate, and consult a licensed doctor for proper diagnosis.',
    meds:'Prescription required based on evaluation.'
  };
}

function handleAI(symptom){
  appendMessage(`<strong>You:</strong> ${symptom}`,'user');
  const {advice, meds} = getDetailedAdvice(symptom);
  appendMessage(`<strong>AI:</strong> ${advice}<br><em>Suggested Medicines:</em> ${meds}`,'ai');
}

sendChatBtn.addEventListener('click', ()=>{
  const txt = chatInput.value.trim();
  if(!txt) return;
  handleAI(txt);
  chatInput.value='';
});
chatInput.addEventListener('keypress', e=>{ if(e.key==='Enter'){ e.preventDefault(); sendChatBtn.click(); } });

/* ---------------------------
   Video Consultation
--------------------------- */
function createRoomId(doctorId){
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2,6);
  return `${doctorId}-${ts}-${rnd}`;
}
function openJitsi(room){
  const url = `https://meet.jit.si/${encodeURIComponent(room)}`;
  window.open(url,'_blank');
}

/* ---------------------------
   Location Tab + Google Map
--------------------------- */
function initMap() {
  const mapEl = document.getElementById('map');
  if(!mapEl) return;
  const map = new google.maps.Map(mapEl, { zoom:15, center:{lat:16.704,lng:74.241} });

  // Add hospital markers
  HOSPITALS.forEach(h=>{
    const marker = new google.maps.Marker({ position:{lat:h.lat,lng:h.lng}, map, title:h.name });
    const infowindow = new google.maps.InfoWindow({ content:`<strong>${h.name}</strong><br>${h.address}<br>Tel: ${h.phone}` });
    marker.addListener('click',()=> infowindow.open(map, marker));
  });

  // Add doctor markers
  DOCTORS.forEach(d=>{
    const marker = new google.maps.Marker({ position:{lat:d.lat,lng:d.lng}, map, title:d.name, icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' });
    const infowindow = new google.maps.InfoWindow({ content:`<strong>${d.name}</strong><br>${d.specialty}<br>${d.hospital}<br>Mobile: ${d.mobile}` });
    marker.addListener('click',()=> infowindow.open(map, marker));
  });
}

/* ---------------------------
   Event Listeners
--------------------------- */
document.addEventListener('click', e=>{
  if(e.target.matches('.btn-consult')){
    const id = e.target.dataset.id;
    selectDoctor(id);
    const room = createRoomId(id);
    openJitsi(room);
  }
  if(e.target.matches('.btn-book')){
    const id = e.target.dataset.id;
    const doc = DOCTORS.find(d=>d.id===id);
    const name = prompt('Your Name:','Patient Name');
    if(!name) return alert('Name required');
    const when = prompt('Preferred Time (YYYY-MM-DD HH:MM):', new Date(Date.now()+3600*1000).toLocaleString());
    const room = createRoomId(id);
    alert(`Appointment booked with ${doc.name} at ${when}. Room ID: ${room}`);
  }
});

/* ---------------------------
   Initialize Page
--------------------------- */
populateSpecialties();
renderDoctors();
renderHospitals();
setTimeout(initMap, 500); // Google Maps initialization
filterSpecialty.addEventListener('change', ()=> renderDoctors(filterSpecialty.value));
