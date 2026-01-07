
        // Function to show main sections
        function showSection(sectionId) {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
        }

        // Function to show appointment types
        function showAppointmentType(type) {
            const forms = document.querySelectorAll('.appointment-form');
            forms.forEach(form => form.classList.remove('active'));
            document.getElementById(type + 'Form').classList.add('active');
            
            const buttons = document.querySelectorAll('#appointments .sub-nav button');
            buttons.forEach(button => button.classList.remove('active'));
            event.target.classList.add('active');
        }

        // Function to show notification types
        function showNotificationType(type) {
            const forms = document.querySelectorAll('.notification-form');
            forms.forEach(form => form.classList.remove('active'));
            document.getElementById(type + 'Form').classList.add('active');
            
            const buttons = document.querySelectorAll('#notifications .sub-nav button');
            buttons.forEach(button => button.classList.remove('active'));
            event.target.classList.add('active');
        }

        // Load data from localStorage
        function loadData() {
            const camps = JSON.parse(localStorage.getItem('camps')) || [];
            const banks = JSON.parse(localStorage.getItem('banks')) || [];
            const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            const notifications = JSON.parse(localStorage.getItem('notifications')) || { doctor: [], user: [] };
            displayCamps(camps);
            displayBanks(banks);
            displayAppointments(appointments);
            displayNotifications(notifications);
        }

        // Display camps
        function displayCamps(camps) {
            const campList = document.getElementById('campList');
            campList.innerHTML = '';
            camps.forEach((camp, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${camp.name}</strong> - ${camp.location} on ${camp.date} (Organizer: ${camp.organizer})`;
                campList.appendChild(li);
            });
        }

        // Display banks
        function displayBanks(banks) {
            const bankList = document.getElementById('bankList');
            bankList.innerHTML = '';
            banks.forEach((bank, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${bank.hospital}</strong> - ${bank.type}: ${bank.quantity} units`;
                bankList.appendChild(li);
            });
        }

        // Display appointments
        function displayAppointments(appointments) {
            const appointmentList = document.getElementById('appointmentList');
            appointmentList.innerHTML = '';
            appointments.forEach((appointment, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${appointment.patient}</strong> with ${appointment.doctor} on ${appointment.date} (${appointment.type})`;
                appointmentList.appendChild(li);
            });
        }

        // Display notifications
        function displayNotifications(notifications) {
            displayNotificationList('doctor', notifications.doctor);
            displayNotificationList('user', notifications.user);
        }

        function displayNotificationList(type, list) {
            const listElement = document.getElementById(type + 'NotificationList');
            listElement.innerHTML = '';
            list.forEach((notification, index) => {
                const li = document.createElement('li');
                li.innerHTML = `${notification.message} <small>(${new Date(notification.date).toLocaleString()})</small>`;
                listElement.appendChild(li);
            });
        }

        // Handle camp form submission
        document.getElementById('campForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('campName').value;
            const location = document.getElementById('campLocation').value;
            const date = document.getElementById('campDate').value;
            const organizer = document.getElementById('campOrganizer').value;
            
            const camps = JSON.parse(localStorage.getItem('camps')) || [];
            camps.push({ name, location, date, organizer });
            localStorage.setItem('camps', JSON.stringify(camps));
            
            displayCamps(camps);
            this.reset();
        });

        // Handle bank form submission
        document.getElementById('bankForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const hospital = document.getElementById('hospitalName').value;
            const type = document.getElementById('bloodType').value;
            const quantity = document.getElementById('quantity').value;
            
            const banks = JSON.parse(localStorage.getItem('banks')) || [];
            const existingIndex = banks.findIndex(bank => bank.hospital === hospital && bank.type === type);
            if (existingIndex !== -1) {
                banks[existingIndex].quantity = quantity;
            } else {
                banks.push({ hospital, type, quantity });
            }
            localStorage.setItem('banks', JSON.stringify(banks));
            
            displayBanks(banks);
            this.reset();
        });

        // Handle appointment forms
        document.getElementById('bookAppointmentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const patient = document.getElementById('patientName').value;
            const doctor = document.getElementById('doctorName').value;
            const date = document.getElementById('appointmentDate').value;
            
            const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            appointments.push({ patient, doctor, date, type: 'Booked' });
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            displayAppointments(appointments);
            
            // Add notification for user
            addNotification('user', `Appointment booked for ${patient} with ${doctor} on ${date}.`);
            
            this.reset();
        });

        document.getElementById('suggestTimeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const patient = document.getElementById('suggestPatient').value;
            const time = document.getElementById('suggestedTime').value;
            
            const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            appointments.push({ patient, doctor: 'Doctor', date: time, type: 'Suggested' });
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            displayAppointments(appointments);
            
            // Add notification for user
            addNotification('user', `Doctor suggested time for ${patient}: ${new Date(time).toLocaleString()}.`);
            
            this.reset();
        });

        document.getElementById('prescribeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const patient = document.getElementById('prescribePatient').value;
            const prescription = document.getElementById('prescription').value;
            
            // Add notification for user
            addNotification('user', `Prescription for ${patient}: ${prescription}.`);
            
            this.reset();
        });

        function addNotification(type, message) {
            const notifications = JSON.parse(localStorage.getItem('notifications')) || { doctor: [], user: [] };
            notifications[type].push({ message, date: new Date().toISOString() });
            localStorage.setItem('notifications', JSON.stringify(notifications));
            displayNotifications(notifications);
        }

        // Load data on page load
        window.onload = loadData;