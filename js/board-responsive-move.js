/**
 * The available status' of the tasks for changing them
 */
let statusArray = [
    'todo',
    'in-progress',
    'awaiting-feedback',
    'done'
];

/**
 * 
 */
function getTask() {
    tasks.forEach(task => {
        console.log(task.status);
    });
}