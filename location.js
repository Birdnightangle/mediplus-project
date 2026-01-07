let map, service, infowindow;

async function loadGoogleMapsAPI() {
  try {
    const response = await fetch("../config.json");
    const config = await response.json();
    const apiKey = config.googleMapsApiKey;

    if (!apiKey) {
      alert("API key missing! Please add it in config.json");
      return;
    }

    // Avoid reloading API twice
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);
  } catch (error) {
    console.error("Error loading API key:", error);
    alert("Unable to load Google Maps API key. Check config.json file.");
  }
}

function initMap() {
  const defaultLocation = { lat: 19.076, lng: 72.8777 }; // Mumbai default
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 14,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    ],
  });
  infowindow = new google.maps.InfoWindow();
}

// Fetch user's GPS location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
        new google.maps.Marker({
          position: pos,
          map: map,
          title: "You are here",
        });
      },
      () => alert("Location access denied. Please enable GPS.")
    );
  } else alert("Geolocation not supported by this browser.");
}

// Search for nearby place
function searchPlace() {
  const query = document.getElementById("placeInput").value;
  if (!query) {
    alert("Please enter a hospital or place name to search.");
    return;
  }

  const request = { query, fields: ["name", "geometry", "formatted_address"] };
  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      const place = results[0];
      map.setCenter(place.geometry.location);
      new google.maps.Marker({
        position: place.geometry.location,
        map: map,
      });
      infowindow.setContent(`<b>${place.name}</b><br>${place.formatted_address}`);
      infowindow.open(map);
    } else alert("No results found. Try another search.");
  });
}
