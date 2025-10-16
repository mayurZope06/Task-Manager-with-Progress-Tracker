// Select DOM elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskTemplate = document.getElementById("task-item-template");
const progressText = document.getElementById("progress-text");
const progressPercent = document.getElementById("progress-percent");
const progressBar = document.getElementById("progress-bar");
const filterSelect = document.getElementById("filter");
const clearCompletedBtn = document.getElementById("clear-completed");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  const filter = filterSelect.value;

  tasks.forEach((task, index) => {
    if (filter === "active" && task.completed) return;
    if (filter === "completed" && !task.completed) return;

    const taskEl = taskTemplate.content.cloneNode(true);
    const checkbox = taskEl.querySelector(".task-checkbox");
    const title = taskEl.querySelector(".task-title");
    const editBtn = taskEl.querySelector(".edit-btn");
    const deleteBtn = taskEl.querySelector(".delete-btn");

    title.textContent = task.title;
    if (task.completed) {
      checkbox.checked = true;
      title.style.textDecoration = "line-through";
      title.style.color = "#888";
    }

    checkbox.addEventListener("change", () => {
      task.completed = !task.completed;
      saveTasks();
      updateProgress();
      renderTasks();
    });

    editBtn.addEventListener("click", () => {
      const newTitle = prompt("Edit your task:", task.title);
      if (newTitle) {
        task.title = newTitle.trim();
        saveTasks();
        renderTasks();
      }
    });

    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      updateProgress();
      renderTasks();
    });

    taskList.appendChild(taskEl);
  });

  updateProgress();
}

// Update progress bar
function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressText.textContent = `${completed} / ${total} tasks completed`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

// Add task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (title === "") return;

  tasks.push({ title, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
});

// Filter change
filterSelect.addEventListener("change", renderTasks);

// Clear completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
});

// Initial render
renderTasks();
