const STORAGE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000/api/'
    : 'https://join.bilal-alac.de/api/';

async function getItem(key) {
    try {
        const response = await fetch(STORAGE_URL + key, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error.message);
        throw error;
    }
}

async function setItem(key, value = null, method = 'POST') {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (value) {
            options.body = JSON.stringify(value);            
        }

        const response = await fetch(STORAGE_URL + key, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Fehler bei der ${method}-Anfrage:`, error);
        throw error;
    }
}