const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');

    const doctorRegister = document.getElementById('doctorRegister');
    const doctorLogin = document.getElementById('doctorLogin');
    const showDoctorRegister = document.getElementById('showDoctorRegister');
    const backToDoctorLogin = document.getElementById('backToDoctorLogin');

    const patientRegister = document.getElementById('patientRegister');
    const patientLogin = document.getElementById('patient');
    const showPatientRegister = document.getElementById('showPatientRegister');
    const backToPatientLogin = document.getElementById('backToPatientLogin');

    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(btn => btn.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
      });
    });

    // Doctor Register ↔ Login
    showDoctorRegister.addEventListener('click', (e) => {
      e.preventDefault();
      contents.forEach(content => content.classList.remove('active'));
      doctorRegister.classList.add('active');
    });

    backToDoctorLogin.addEventListener('click', (e) => {
      e.preventDefault();
      contents.forEach(content => content.classList.remove('active'));
      doctorLogin.classList.add('active');
    });

    // Patient Register ↔ Login
    showPatientRegister.addEventListener('click', (e) => {
      e.preventDefault();
      contents.forEach(content => content.classList.remove('active'));
      patientRegister.classList.add('active');
    });

    backToPatientLogin.addEventListener('click', (e) => {
      e.preventDefault();
      contents.forEach(content => content.classList.remove('active'));
      patientLogin.classList.add('active');
    });
    // ⚠️ IMPORTANT: Replace the placeholders below with your actual Firebase config.
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",              // <-- Replace this
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // <-- Replace this
    projectId: "YOUR_PROJECT_ID",        // <-- Replace this
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore(); 
// ... rest of the code ...