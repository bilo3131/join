function addDragItemEventListener() {
    const draggableItems = document.querySelectorAll('.task-item');
    const dropContainers = document.querySelectorAll('.task-col');

    draggableItems.forEach(item => {
        item.addEventListener('dragstart', () => itemDragStartEvent(item, dropContainers));
        item.addEventListener('dragend', () => itemDragEndEvent(item, dropContainers));
        item.addEventListener('click', () => itemClickEvent(item));
    });
}

function itemDragStartEvent(item, dropContainers) {
    item.classList.add('dragging');
    dropContainers.forEach(container => container.classList.add('mark-drop'));
}

function itemDragEndEvent(item, dropContainers) {
    item.classList.remove('dragging');
    dropContainers.forEach(container => container.classList.remove('mark-drop'));
    updateProgress(item);
}

function itemClickEvent(item) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const task = tasks.find(task => task.id == item.dataset.id);
    const category = userCategories.find(category => category.id == task.category)
    
    const subtasks = renderSubtasks(task);
    let assignees = '';
    task.assigned_to.forEach(assignee => {
        const contact = contacts.find(contact => contact.id == assignee);
        const initials = getInitials(contact);
        assignees += modalAssigneHTMLTemp(initials, contact);
    });
    
    modalContent.innerHTML = modalItemHTMLTemp(task, category, assignees, subtasks);
    modal.showModal();
}

function addDragContainerEventListener() {
    const dropContainers = document.querySelectorAll('.task-col');
    dropContainers.forEach(container => {
        container.addEventListener('dragover', event => containerDragOverEvent(event, container));
    });
}

function containerDragOverEvent(event, container) {
    event.preventDefault();
    const afterElement = getDragAfterElement(container, event.clientY);
    const draggedItem = document.querySelector('.dragging');

    if (afterElement == null) {
        container.appendChild(draggedItem);
    } else {
        container.insertBefore(draggedItem, afterElement);
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset,
                element: child
            };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}