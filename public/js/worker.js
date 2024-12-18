self.addEventListener('message', function(e) {
  if (e.data.latitude && e.data.longitude) {
    const { latitude, longitude } = e.data;

    const sendLocation = async () => {
      try {
        const response = await fetch('/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ latitude, longitude })
        });

        if (!response.ok) {
          throw new Error('Failed to send location data');
        }
        console.log(`Location sent successfully at ${new Date().toISOString()}`);
      } catch (error) {
        console.error('Error sending location:', error);
      }
    };

    // Send location immediately when starting
    sendLocation();
    // Set up a setInterval to send location every 15 minutes (900000 ms)
    setInterval(sendLocation, 900000);
  } else {
    console.error('Invalid location data received');
  }
});

// Function to get location using IP Geolocation (without asking for permission)
const getLocationFromIP = async () => {
try {
  const response = await fetch('https://ipinfo.io/json?token=YOUR_TOKEN'); // Replace YOUR_TOKEN with your actual API token
  const data = await response.json();
  const [latitude, longitude] = data.loc.split(',');
  console.log('IP Geolocation:', latitude, longitude);
  // Send the location here or process further
  self.postMessage({ latitude, longitude });
} catch (error) {
  console.error('Error fetching IP location:', error);
  fallbackToGeolocation();
}
};

// Function to get location using Browser's Geolocation API (asks for permission)
const getLocationFromBrowser = () => {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log('Browser Geolocation:', latitude, longitude);
    // Send the location here or process further
    self.postMessage({ latitude, longitude });
  }, function(error) {
    console.error('Error getting location from browser', error);
  });
} else {
  console.error('Geolocation is not supported by this browser');
}
};

// Function to fall back to browser geolocation if IP-based fails
const fallbackToGeolocation = () => {
console.log('Falling back to browser geolocation...');
getLocationFromBrowser();
};

// First, try to get location using IP
getLocationFromIP();
