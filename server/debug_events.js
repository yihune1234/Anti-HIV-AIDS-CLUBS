const fetch = require('node-fetch');

async function debugEvents() {
    try {
        const response = await fetch('http://localhost:5000/api/events');
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Body:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

debugEvents();
