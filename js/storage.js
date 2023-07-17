/** Token for the remote storage */
const STORAGE_TOKEN = 'K04GY8EGH0DPP9YZRYTM3Q7KK9E05FZ35IHUWJ3I';
/** URL of the remote storge */
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Set data that used to be saved in the remote storage
 * @param {JSON} key Key of the respective JSON-Array to save data
 * @param {Data} value Value of the respectiv key
 * @returns a POST method to save the data in the remote storage
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Get data which is saved in the remote storage
 * @param {JSON} key Key of the respective JSON-Array to save data
 * @returns data which is saved in the remote storage
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    // console.log(JSON.stringify(url));
    // debugger;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}