const state = {
  activeTab: 'Home',
  message: '',
  streak: 6,
  graceDays: 2,
  cactusStage: 1,
  form: {
    name: '',
    type: 'Medication',
    time: '8:00 AM',
    repeat: 'Every day',
    detail: '',
    note: '',
  },
  tasks: [
    {
      id: 1,
      time: '8:00 AM',
      name: 'Blood Sugar Check',
      detail: 'Before breakfast',
      type: 'Blood Sugar',
      done: false,
      snoozed: false,
      history: [
        { date: 'Mon', status: 'done' },
        { date: 'Tue', status: 'done' },
        { date: 'Wed', status: 'done' },
        { date: 'Thu', status: 'done' },
        { date: 'Fri', status: 'pending' },
      ],
    },
    {
      id: 2,
      time: '8:30 AM',
      name: 'Metformin',
      detail: '500 mg · Take with food',
      type: 'Medication',
      done: false,
      snoozed: false,
      history: [
        { date: 'Mon', status: 'done' },
        { date: 'Tue', status: 'done' },
        { date: 'Wed', status: 'missed' },
        { date: 'Thu', status: 'done' },
        { date: 'Fri', status: 'pending' },
      ],
    },
  ],
};

function cactusHtml() {
  const showLeftArm = state.cactusStage >= 2;
  const showRightArm = state.cactusStage >= 3;
  const completedCount = state.tasks.filter((task) => task.done).length;

  return `
    <div class="cactus-wrap">
      <div class="cactus-inner">
        ${showLeftArm ? '<div class="cactus-arm cactus-arm-left"></div>' : ''}
        ${showRightArm ? '<div class="cactus-arm cactus-arm-right"></div>' : ''}
        <div class="cactus-body ${completedCount ? 'cactus-body-happy' : ''}">
          <div class="spike spike-1"></div>
          <div class="spike spike-2"></div>
          <div class="spike spike-3"></div>
          <div class="spike spike-4"></div>
          <div class="eye eye-left"></div>
          <div class="eye eye-right"></div>
          <div class="mouth"></div>
          <div class="flower">🌸</div>
        </div>
      </div>
    </div>
  `;
}

function homeScreen() {
  return `
    <div class="section header-section">
      <div class="header-row">
        <div>
          <p class="title-lg">Good morning</p>
          <p class="muted-text">Your cactus is ready for today’s check-in.</p>
        </div>
        <button class="icon-button">⚙️</button>
      </div>
    </div>

    <div class="section scene-section">
      <div class="scene-card">
        <div class="sun"></div>
        <div class="hill hill-back"></div>
        <div class="hill hill-front"></div>
        ${cactusHtml()}
        <div class="scene-item rock">🪨</div>
        <div class="scene-item flower-right">🌼</div>
        ${state.cactusStage >= 4 ? '<div class="scene-item lizard">🦎</div>' : ''}
      </div>
    </div>

    ${
      state.message
        ? `
      <div class="section message-section">
        <div class="message-box">${state.message}</div>
      </div>
    `
        : ''
    }

    <div class="section">
      <h2 class="title-md">Today’s Check-Ins</h2>
    </div>

    <div class="section card-list">
      ${state.tasks
        .map(
          (task) => `
        <div class="task-card">
          <div class="task-top-row">
            <p class="task-time">${task.time}</p>
            <span class="task-chip">${task.type}</span>
          </div>
          <p class="task-name">${task.name}</p>
          <p class="task-detail">${task.detail}</p>
          ${
            task.snoozed && !task.done
              ? '<p class="task-snoozed">Snoozed for now</p>'
              : ''
          }
          <div class="task-button-row">
            <button class="primary-button ${task.done ? 'primary-button-done' : ''}" onclick="handleDone(${task.id})">
              ${task.done ? 'Done ✓' : 'Done'}
            </button>
            <button class="secondary-button" onclick="handleSnooze(${task.id})">
              Snooze
            </button>
          </div>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="section bottom-card-section">
      <div class="summary-card">
        <p class="summary-label">Current Streak</p>
        <p class="summary-value">${state.streak} days</p>
        <p class="summary-subtext">Grace Days Left: ${state.graceDays}</p>
      </div>
    </div>
  `;
}

function tasksScreen() {
  return `
    <div class="section">
      <h1 class="title-lg">Add Task</h1>
      <p class="muted-text">Keep this quick. Your cactus hates long forms.</p>
    </div>

    <form class="section form-wrap" onsubmit="handleAddTask(event)">
      <label class="form-field">
        <span class="field-label">What do you want to track?</span>
        <input
          name="name"
          value="${state.form.name}"
          placeholder="Blood Sugar Check"
          class="text-input"
        />
      </label>

      <label class="form-field">
        <span class="field-label">Task type</span>
        <select name="type" class="text-input">
          ${['Medication', 'Blood Sugar', 'Injection', 'Vitamin', 'Routine']
            .map(
              (type) =>
                `<option ${state.form.type === type ? 'selected' : ''}>${type}</option>`
            )
            .join('')}
        </select>
      </label>

      <label class="form-field">
        <span class="field-label">When should I remind you?</span>
        <input
          name="time"
          value="${state.form.time}"
          placeholder="8:00 AM"
          class="text-input"
        />
      </label>

      <label class="form-field">
        <span class="field-label">How often?</span>
        <select name="repeat" class="text-input">
          ${['Every day', 'Weekdays', 'Custom']
            .map(
              (option) =>
                `<option ${state.form.repeat === option ? 'selected' : ''}>${option}</option>`
            )
            .join('')}
        </select>
      </label>

      <label class="form-field">
        <span class="field-label">${
          state.form.type === 'Medication'
            ? 'Dose'
            : state.form.type === 'Blood Sugar'
            ? 'Target range'
            : state.form.type === 'Injection'
            ? 'Details'
            : 'Optional detail'
        }</span>
        <input
          name="detail"
          value="${state.form.detail}"
          placeholder="${
            state.form.type === 'Medication'
              ? '500 mg'
              : state.form.type === 'Blood Sugar'
              ? '80–130 mg/dL'
              : state.form.type === 'Injection'
              ? '10 units'
              : 'Optional'
          }"
          class="text-input"
        />
      </label>

      <label class="form-field">
        <span class="field-label">Optional note</span>
        <textarea
          name="note"
          placeholder="Before breakfast"
          class="text-input text-area"
        >${state.form.note}</textarea>
      </label>

      <button class="primary-button full-width-button" type="submit">Save Task</button>
    </form>
  `;
}

function historyScreen() {
  return `
    <div class="section">
      <h1 class="title-lg">History</h1>
      <p class="muted-text">A simple look at how things are going.</p>
    </div>

    <div class="section card-list">
      <div class="summary-card">
        <p class="summary-label">Adherence Rate</p>
        <p class="summary-value">92%</p>
        <p class="summary-subtext">Longest Streak: 21 days</p>
      </div>

      ${state.tasks
        .map(
          (task) => `
        <div class="task-card">
          <p class="task-name">${task.name}</p>
          <div class="history-grid">
            ${task.history
              .map(
                (entry) => `
              <div class="history-item">
                <div class="history-status ${
                  entry.status === 'done'
                    ? 'history-done'
                    : entry.status === 'missed'
                    ? 'history-missed'
                    : 'history-pending'
                }">
                  ${entry.status === 'done' ? '✓' : entry.status === 'missed' ? '–' : '•'}
                </div>
                <p class="history-date">${entry.date}</p>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

function desertScreen() {
  return `
    <div class="section">
      <h1 class="title-lg">Your Desert</h1>
      <p class="muted-text">Your little ecosystem grows with consistency.</p>
    </div>

    <div class="section card-list">
      <div class="scene-card desert-large">
        <div class="sun large-sun"></div>
        <div class="hill hill-back hill-large-back"></div>
        <div class="hill hill-front hill-large-front"></div>
        ${cactusHtml()}
        <div class="scene-item rock large-rock">🪨</div>
        <div class="scene-item flower-right large-flower">🌼</div>
        ${state.cactusStage >= 2 ? '<div class="scene-item bloom-left">🌸</div>' : ''}
        ${state.cactusStage >= 3 ? '<div class="scene-item mountain">⛰️</div>' : ''}
        ${state.cactusStage >= 4 ? '<div class="scene-item lizard large-lizard">🦎</div>' : ''}
      </div>

      <div class="task-card">
        <p class="summary-label">Cactus Stage</p>
        <p class="summary-value">${state.cactusStage} / 4</p>
        <div class="milestone-list">
          <p>3 days: flower appears</p>
          <p>7 days: first arm grows</p>
          <p>14 days: second arm grows</p>
          <p>30 days: desert scene expands</p>
        </div>
      </div>
    </div>
  `;
}

function render() {
  const screen = document.getElementById('screen-content');

  if (state.activeTab === 'Home') screen.innerHTML = homeScreen();
  if (state.activeTab === 'Tasks') screen.innerHTML = tasksScreen();
  if (state.activeTab === 'History') screen.innerHTML = historyScreen();
  if (state.activeTab === 'Desert') screen.innerHTML = desertScreen();

  document.querySelectorAll('.nav-button').forEach((button) => {
    button.classList.toggle('nav-button-active', button.dataset.tab === state.activeTab);
    button.onclick = () => {
      state.activeTab = button.dataset.tab;
      state.message = '';
      render();
    };
  });

  const form = document.querySelector('form');
  if (form) {
    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', (e) => {
        state.form[e.target.name] = e.target.value;
      });
      field.addEventListener('change', (e) => {
        state.form[e.target.name] = e.target.value;
        render();
      });
    });
  }
}

window.handleDone = function (id) {
  state.tasks = state.tasks.map((task) =>
    task.id === id ? { ...task, done: true, snoozed: false } : task
  );
  state.streak += 1;
  state.cactusStage = Math.min(4, state.cactusStage + 1);
  state.message = 'Nice work. Your cactus perked up.';
  render();
};

window.handleSnooze = function (id) {
  state.tasks = state.tasks.map((task) =>
    task.id === id ? { ...task, snoozed: true } : task
  );
  state.message = 'Reminder snoozed.';
  render();
};

window.handleAddTask = function (event) {
  event.preventDefault();

  if (!state.form.name.trim()) return;

  const detailParts = [state.form.detail, state.form.note].filter(Boolean);

  state.tasks.push({
    id: Date.now(),
    time: state.form.time,
    name: state.form.name,
    detail: detailParts.join(' · ') || 'New check-in',
    type: state.form.type,
    done: false,
    snoozed: false,
    history: [
      { date: 'Mon', status: 'pending' },
      { date: 'Tue', status: 'pending' },
      { date: 'Wed', status: 'pending' },
      { date: 'Thu', status: 'pending' },
      { date: 'Fri', status: 'pending' },
    ],
  });

  state.form = {
    name: '',
    type: 'Medication',
    time: '8:00 AM',
    repeat: 'Every day',
    detail: '',
    note: '',
  };

  state.activeTab = 'Home';
  state.message = 'Your cactus has a new check-in.';
  render();
};

render();