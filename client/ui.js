const taskForm = document.getElementById('taskForm');

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const task = getFormData(e.target);
    App.createTask(task);
})

const getFormData = (form) => {
    const object = {};
    const formData = new FormData(form);
    formData.forEach((value, key) => object[key] = value);
    return object;
}