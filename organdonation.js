/* ---------------------------
   Demo data + persistence keys
--------------------------- */
const HOSPITALS_KEY = 'org_hospitals_stock';
const DONORS_KEY = 'org_donors';

const defaultHospitals = [
  { id:'h1', name:'D.Y. Patil Hospital', contact:'0231-123456', stocks: [ {organ:'Kidney', count:2, notes:'O+ focus'},{organ:'Cornea', count:5, notes:''} ] },
  { id:'h2', name:'City Heart Center', contact:'0231-987654', stocks: [ {organ:'Heart', count:1, notes:''},{organ:'Liver', count:0, notes:''} ] }
];

function readHospitals() {
  return JSON.parse(localStorage.getItem(HOSPITALS_KEY) || JSON.stringify(defaultHospitals));
}
function saveHospitals(data) {
  localStorage.setItem(HOSPITALS_KEY, JSON.stringify(data));
}

function readDonors() {
  return JSON.parse(localStorage.getItem(DONORS_KEY) || '[]');
}
function saveDonors(data) {
  localStorage.setItem(DONORS_KEY, JSON.stringify(data));
}

/* ---------------------------
   Initialize form selects and UI
--------------------------- */
const donorHospitalSelect = document.getElementById('donorHospital');
const adminHospitalSelect = document.getElementById('adminHospital');

function populateHospitalSelects() {
  const hospitals = readHospitals();
  donorHospitalSelect.innerHTML = '<option value="">No Preference</option>';
  adminHospitalSelect.innerHTML = '<option value="">Select hospital</option>';
  hospitals.forEach(h => {
    const opt = document.createElement('option'); opt.value = h.id; opt.textContent = h.name;
    donorHospitalSelect.appendChild(opt);
    const opt2 = opt.cloneNode(true); adminHospitalSelect.appendChild(opt2);
  });
}

/* ---------------------------
   Form handling: donor registration
--------------------------- */
const donorForm = document.getElementById('donorForm');
const formMsg = document.getElementById('formMsg');
const downloadBtn = document.getElementById('downloadUndertaking');

donorForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('donorName').value.trim();
  const age = parseInt(document.getElementById('donorAge').value,10);
  const mobile = document.getElementById('donorMobile').value.trim();
  const checks = Array.from(document.querySelectorAll('.organCheck')).filter(i=>i.checked).map(i=>i.value);
  const hospital = donorHospitalSelect.value || '';
  const consent = document.getElementById('consent').checked;

  if (!name || !age || !mobile || checks.length===0 || !consent) {
    formMsg.textContent = 'Please complete all fields and provide consent.';
    formMsg.classList.add('text-red-500');
    return;
  }

  // create donor record
  const donors = readDonors();
  const donor = { id: 'D'+Date.now(), name, age, mobile, organs: checks, preferredHospital: hospital, date: new Date().toISOString(), status:'pledged' };
  donors.push(donor);
  saveDonors(donors);

  formMsg.textContent = 'Thank you — your undertaking is recorded.';
  formMsg.classList.remove('text-red-500');
  formMsg.classList.add('text-green-500');

  // reset form (keep hospital selected for convenience)
  donorForm.reset();
  populateHospitalSelects();
  renderDonorTable();
  renderStats();
  lastRegisteredDonor = donor; // store last for download
});

let lastRegisteredDonor = null;
downloadBtn.addEventListener('click', () => {
  const donors = readDonors();
  const donor = lastRegisteredDonor || donors[donors.length-1];
  if (!donor) { alert('No donor record available to download'); return; }
  const hospitalName = donor.preferredHospital ? (readHospitals().find(h=>h.id===donor.preferredHospital)?.name || '') : 'No preference';
  const txt = `Organ Donation Undertaking\n\nName: ${donor.name}\nAge: ${donor.age}\nMobile: ${donor.mobile}\nPledged organs: ${donor.organs.join(', ')}\nPreferred hospital: ${hospitalName}\nDate: ${new Date(donor.date).toLocaleString()}\n\nI hereby undertake to donate the above organ(s) after my death in accordance with applicable laws and medical protocols.\n\n(Signature)\n`;
  const blob = new Blob([txt], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `undertaking_${donor.id}.txt`; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

/* ---------------------------
   Render stock table
--------------------------- */
const stockTable = document.getElementById('stockTable');
const donorTable = document.getElementById('donorTable');
const statDonors = document.getElementById('statDonors');
const statOrgans = document.getElementById('statOrgans');

function renderStockTable(filter='') {
  const hospitals = readHospitals();
  stockTable.innerHTML = '';
  hospitals.forEach(h => {
    h.stocks.forEach(s => {
      if (filter) {
        const f = filter.toLowerCase();
        if (!h.name.toLowerCase().includes(f) && !s.organ.toLowerCase().includes(f)) return;
      }
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="py-2 align-top">${h.name}<div class="tiny muted">${h.contact}</div></td>
        <td class="align-top">${s.organ}</td>
        <td class="align-top">${s.count}</td>
        <td class="align-top tiny">${h.contact}</td>
        <td class="align-top tiny">${s.notes || '-'}</td>
        <td class="text-right align-top"><button class="px-2 py-1 bg-amber-500 text-white rounded confirmBtn" data-h="${h.id}" data-organ="${s.organ}">Confirm Use</button></td>
      `;
      stockTable.appendChild(tr);
    });
  });
}

/* ---------------------------
   Render donor table
--------------------------- */
function renderDonorTable() {
  const donors = readDonors();
  donorTable.innerHTML = '';
  donors.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="py-2 align-top">${d.name}</td>
      <td class="align-top">${d.age}</td>
      <td class="align-top">${d.mobile}</td>
      <td class="align-top">${d.organs.join(', ')}</td>
      <td class="align-top">${d.preferredHospital ? (readHospitals().find(h=>h.id===d.preferredHospital)?.name || '') : 'No preference'}</td>
      <td class="text-right align-top">
        <button class="px-2 py-1 bg-cyan-600 text-white rounded donationBtn" data-id="${d.id}">Mark Collected</button>
        <button class="px-2 py-1 bg-slate-200 text-slate-700 rounded downloadBtn" data-id="${d.id}">Download</button>
      </td>
    `;
    donorTable.appendChild(tr);
  });
}

/* ---------------------------
   Confirm collected donation (admin action)
   - Marks donor as collected and increases hospital stock (simulate)
--------------------------- */
document.addEventListener('click', (e) => {
  // Mark donor as collected: 'Mark Collected' button
  if (e.target.matches('.donationBtn')) {
    const id = e.target.dataset.id;
    const donors = readDonors();
    const donor = donors.find(x => x.id === id);
    if (!donor) return alert('Donor not found');
    // Ask admin to choose hospital to add organs to
    let hospId = donor.preferredHospital;
    if (!hospId) {
      const hs = readHospitals();
      hospId = hs[0].id; // fallback to first
    }
    const hospitals = readHospitals();
    const hosp = hospitals.find(h => h.id === hospId);
    donor.status = 'collected';
    donor.collectedDate = new Date().toISOString();
    // Add organs to hospital stock (merge counts)
    donor.organs.forEach(org => {
      const existing = hosp.stocks.find(s => s.organ === org);
      if (existing) existing.count = existing.count + 1;
      else hosp.stocks.push({organ: org, count: 1, notes: 'Added from collected donor'});
    });
    saveHospitals(hospitals);
    saveDonors(donors);
    renderStockTable(document.getElementById('searchOrg').value.trim());
    renderDonorTable();
    renderStats();
    alert(`Marked ${donor.name} as collected — organs added to ${hosp.name}`);
  }

  // Download donor undertaking from registry
  if (e.target.matches('.downloadBtn')) {
    const id = e.target.dataset.id;
    const donors = readDonors();
    const donor = donors.find(x => x.id === id);
    if (!donor) return;
    const hospitalName = donor.preferredHospital ? (readHospitals().find(h=>h.id===donor.preferredHospital)?.name || '') : 'No preference';
    const txt = `Organ Donation Undertaking\n\nName: ${donor.name}\nAge: ${donor.age}\nMobile: ${donor.mobile}\nPledged organs: ${donor.organs.join(', ')}\nPreferred hospital: ${hospitalName}\nDate: ${new Date(donor.date).toLocaleString()}\n\nI hereby undertake to donate the above organ(s) after my death in accordance with applicable laws and medical protocols.\n\n(Signature)\n`;
    const blob = new Blob([txt], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `undertaking_${donor.id}.txt`; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  // Admin: Confirm use of stock (simulate removal)
  if (e.target.matches('.confirmBtn')) {
    const hid = e.target.dataset.h;
    const organ = e.target.dataset.organ;
    const hospitals = readHospitals();
    const h = hospitals.find(x=>x.id===hid);
    const stock = h.stocks.find(s=>s.organ===organ);
    if (!stock || stock.count<=0) return alert('No stock available to confirm');
    const qty = parseInt(prompt(`Confirm use of how many ${organ}s from ${h.name}?`, '1'),10);
    if (!qty || qty<=0) return;
    if (qty > stock.count) return alert('Insufficient stock');
    stock.count -= qty;
    saveHospitals(hospitals);
    renderStockTable(document.getElementById('searchOrg').value.trim());
    renderStats();
    alert(`Confirmed use of ${qty} ${organ}(s) from ${h.name}`);
  }
});

/* ---------------------------
   Admin modal for adding stock
--------------------------- */
const stockModal = document.getElementById('stockModal');
document.getElementById('addStockBtn').addEventListener('click', ()=> {
  populateHospitalSelects();
  stockModal.classList.remove('hidden');
  stockModal.style.display = 'flex';
});
document.getElementById('closeStockModal').addEventListener('click', ()=> {
  stockModal.classList.add('hidden');
});
document.getElementById('saveStock').addEventListener('click', ()=> {
  const hid = document.getElementById('adminHospital').value;
  const organ = document.getElementById('adminOrgan').value;
  const count = parseInt(document.getElementById('adminCount').value,10) || 0;
  const notes = document.getElementById('adminNotes').value.trim();
  if (!hid || !organ || count<=0) return alert('Please complete fields');
  const hospitals = readHospitals();
  const h = hospitals.find(x => x.id === hid);
  if (!h) return;
  const existing = h.stocks.find(s => s.organ === organ);
  if (existing) existing.count += count;
  else h.stocks.push({organ, count, notes});
  saveHospitals(hospitals);
  stockModal.classList.add('hidden');
  renderStockTable(document.getElementById('searchOrg').value.trim());
  renderStats();
});

/* ---------------------------
   Search/filter
--------------------------- */
document.getElementById('searchOrg').addEventListener('input', (e) => {
  renderStockTable(e.target.value.trim());
});

/* ---------------------------
   Stats
--------------------------- */
function renderStats() {
  const donors = readDonors();
  statDonors.textContent = donors.length;
  const totalOrgans = donors.reduce((acc, d) => acc + (d.organs?.length || 0), 0);
  statOrgans.textContent = totalOrgans;
}

/* ---------------------------
   Initial render
--------------------------- */
populateHospitalSelects();
renderStockTable();
renderDonorTable();
renderStats();
