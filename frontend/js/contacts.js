async function init() {
    contacts = await getItem(CONTACTS_KEY);
    initContactButtons();
    if (typeof navigationReady !== 'undefined') await navigationReady;
    highlightSection('contacts-desktop', 'contacts-mobile');
    renderContactList();
}

function initContactButtons() {
    const modal = document.getElementById('modal');
    const newContactBtn = document.getElementById('new-contact');
    const closeModalBtn = document.getElementById('close-modal');

    newContactBtn?.addEventListener('click', () => addContactEventListener());
    closeModalBtn?.addEventListener('click', () => modal?.close());
}

function renderContactList() {
    const contactListEl = document.getElementById('contact-list')
    let contactList = '';
    let char = '';
    sortContacts();
    for (let contact of contacts) {
        const firstnameChar = contact.firstname.charAt(0).toUpperCase();
        const initials = getInitials(contact);
        if (firstnameChar != char) {
            char = firstnameChar;
            contactList += contactSeparatorTemp(firstnameChar);
        } contactList += contactTemp(contact, initials);
    } contactListEl.innerHTML = contactList;
}

function sortContacts() {
    contacts = contacts.sort((contactA, contactB) => {
        return contactA.firstname.toLowerCase().localeCompare(contactB.firstname.toLowerCase())
    });
}

async function setContactDetails(id) {
    const contact = await getItem(CONTACTS_KEY + id + '/')    
    const contactDetailsEl = document.getElementById('contact-details-body');
    const bubbleEl = document.getElementById('contact-details-bubble');
    const initialsEl = document.getElementById('contact-details-initials');
    const nameEl = document.getElementById('contact-details-name');
    const emailEl = document.getElementById('contact-details-email');
    const phoneEl = document.getElementById('contact-details-phone');
    const editBtn = document.getElementById('edit-contact');
    const deleteBtn = document.getElementById('delete-contact');
    showContactDetails(id, contactDetailsEl, bubbleEl, initialsEl, nameEl, emailEl, phoneEl, editBtn, deleteBtn, contact);
    if (window.matchMedia("(max-width: 576px)")) {
        hideDetailsOnMobileButton();
    }
}

async function editContactEventListener(id) {
    const modal = document.getElementById('modal');
    const modalSubmitBtn = document.getElementById('modal-submit');
    const modalHeader = document.getElementById('modal-header');
    const contact = await getItem(CONTACTS_KEY + id + '/');

    modalHeader.innerHTML = 'Edit Contact';
    modalSubmitBtn.innerHTML = 'Save Contact';
    modalSubmitBtn.innerHTML += '<img src="./assets/icons/check_white.svg" class="btn-icon">';
    modalSubmitBtn.onclick = () => editContact(contact);
    prefillInputFields(contact);
    modal?.showModal();
}

function prefillInputFields(contact) {
    const firstnameInp = document.getElementById('new-firstname');
    const lastnameInp = document.getElementById('new-lastname');
    const emailInp = document.getElementById('new-email');
    const phoneInp = document.getElementById('new-phone');

    firstnameInp.value = contact.firstname;
    lastnameInp.value = contact.lastname;
    emailInp.value = contact.email;
    phoneInp.value = contact.phone;
}

function addContactEventListener() {
    const modalHeader = document.getElementById('modal-header');
    const modalSubmitBtn = document.getElementById('modal-submit');

    modalHeader.innerHTML = 'Add Contact';
    modalSubmitBtn.innerHTML = 'Create Contact';
    modalSubmitBtn.innerHTML += '<img src="./assets/icons/check_white.svg" class="btn-icon">';
    modalSubmitBtn.onclick = addContact;
    clearContactInputFields();
    modal?.showModal();
}

function editContact(contact) {
    const firstnameInp = document.getElementById('new-firstname');
    const lastnameInp = document.getElementById('new-lastname');
    const emailInp = document.getElementById('new-email');
    const phoneInp = document.getElementById('new-phone');
    if (firstnameInp.checkValidity() && lastnameInp.checkValidity() && emailInp.checkValidity() && phoneInp.checkValidity()) {
        contact.firstname = firstnameInp.value;
        contact.lastname = lastnameInp.value;
        contact.email = emailInp.value;
        contact.phone = phoneInp.value;
        storeContact(contact.id, contact, 'Edited succesfully!', 'PUT');
    }
}

async function storeContact(id, data, text = null, method = 'POST') {
    sortContacts();
    await setItem(CONTACTS_KEY + id + '/', data, method);
    init();
    setContactDetails(id);
    text ? notify(text) : notify();
}

function clearContactInputFields() {
    const firstnameInp = document.getElementById('new-firstname');
    const lastnameInp = document.getElementById('new-lastname');
    const emailInp = document.getElementById('new-email');
    const phoneInp = document.getElementById('new-phone');

    firstnameInp.value = '';
    lastnameInp.value = '';
    emailInp.value = '';
    phoneInp.value = '';
}

function hideDetailsOnMobileButton() {
    const contactDetails = document.getElementById('contact-details');
    const hideDetailsBtn = document.getElementById('hide-details');

    contactDetails.style.display = 'block';
    hideDetailsBtn.addEventListener('click', () => {
        contactDetails.style.display = 'none';
    });
}

async function deleteContact(id) {
    await setItem(CONTACTS_KEY + id + '/', null, 'DELETE');
    init();
    notify('Deleted succesfully!');
    if (window.matchMedia("(max-width: 576px)")) {
        const contactDetails = document.getElementById('contact-details');
        contactDetails.style.display = 'none';
    }
}

function showContactDetails(id, contactDetailsEl, bubbleEl, initialsEl, nameEl, emailEl, phoneEl, editBtn, deleteBtn, contact) {
    contactDetailsEl.style.display = 'flex';
    bubbleEl.style = `background: hsl(${contact.color}, 100%, 30%)`;
    initialsEl.innerHTML = getInitials(contact);
    nameEl.innerHTML = `${contact.firstname} ${contact.lastname}`;
    emailEl.innerHTML = contact.email || '';
    emailEl.href = contact.email ? `mailto:${contact.email}` : '';
    phoneEl.innerHTML = contact.phone || '';
    phoneEl.href = contact.phone ? `tel:${contact.phone}` : '';
    editBtn.onclick = () => editContactEventListener(id);
    deleteBtn.onclick = () => deleteContact(id);
}

async function addContact() {
    const firstnameInp = document.getElementById('new-firstname');
    const lastnameInp = document.getElementById('new-lastname');
    const emailInp = document.getElementById('new-email');
    const phoneInp = document.getElementById('new-phone');

    if (firstnameInp.checkValidity() && lastnameInp.checkValidity() && emailInp.checkValidity()) {
        const contact = createContact(firstnameInp, lastnameInp, emailInp, phoneInp);
        notify('Added successfully!');
        await setItem(CONTACTS_KEY, contact);
        init();
    }
}

function createContact(firstnameInp, lastnameInp, emailInp, phoneInp) {
    const color = Math.floor(Math.random() * 355);
    const contact = {
        firstname: firstnameInp.value,
        lastname: lastnameInp.value,
        email: emailInp.value || null,
        phone: phoneInp.value ? phoneInp.value : null,
        color: color
    }
    return contact;
}

init();