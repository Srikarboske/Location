// Function to get location using IP-based geolocation
const getLocationFromIP = async () => {
  try {
    const response = await fetch('https://ipinfo.io/json?token=YOUR_TOKEN'); // Replace with your API token
    if (!response.ok) {
      throw new Error('Failed to fetch IP-based location');
    }

    const data = await response.json();
    const [latitude, longitude] = data.loc.split(',');
    console.log('IP Geolocation:', { latitude, longitude });

    // Send location to your server
    sendLocationToServer(latitude, longitude);
  } catch (error) {
    console.error('Error fetching IP-based location:', error);
  }
};

// Function to send location to the server
const sendLocationToServer = async (latitude, longitude) => {
  try {
    const response = await fetch('/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (!response.ok) {
      throw new Error('Failed to send location data');
    }

    console.log(`Location sent successfully at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Error sending location:', error);
  }
};

// Call the IP-based geolocation function
getLocationFromIP();

// Optional: Repeat location sending every 15 minutes (900000 ms)
setInterval(getLocationFromIP, 900000);
