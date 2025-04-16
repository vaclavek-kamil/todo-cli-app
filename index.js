const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Set up readline interface
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const SAVE_FILE = path.join(__dirname, "save.json");
let todos = [];
let selectedIndex = 0;
let isInputMode = false;
let inputBuffer = '';

// Load todos from file
function loadTodos() {
	try {
		if (fs.existsSync(SAVE_FILE)) {
			const data = fs.readFileSync(SAVE_FILE, 'utf8');
			todos = JSON.parse(data);
		}
	} catch (err) {
		console.error('Error loading todos:', err.message);
	}
}

// Save todos to file
function saveTodos() {
	try {
		fs.writeFileSync(SAVE_FILE, JSON.stringify(todos, null, 2));
		console.log('Todos saved successfully.');
	} catch (err) {
		console.error('Error saving todos:', err.message);
	}
}

// Display the todo list
function displayTodos() {
	console.clear();
	console.log('=== Todo List ===');
	let linesUsed = 1; // Track lines for cursor positioning

	if (todos.length === 0) {
		console.log('No todos.');
		linesUsed += 1;
	} else {
		todos.forEach((todo, index) => {
			const marker = index === selectedIndex ? '>' : ' ';
			const status = todo.completed ? '[x]' : '[ ]';
			console.log(`${marker} ${status} ${todo.text}`);
			linesUsed += 1;
		});
	}

	// Add a blank line after the list
	console.log('');
	linesUsed += 1;

	// Store the line where input should appear
	const inputLine = linesUsed;

	// If in input mode, print the input prompt
	if (isInputMode) {
		console.log(`New task: ${inputBuffer}`);
		linesUsed += 1;
	}

	// Get terminal height (default to 24 if not available)
	const terminalHeight = process.stdout.rows - 1 /* -1 cause tmux */ || 24;

	// Add newlines to push controls to the bottom
	for (let i = linesUsed; i < terminalHeight - 1; i++) {
		console.log('');
	}

	// Print controls at the bottom
	console.log('↑/↓: Navigate, n: Create, space: Mark, d: Delete, s: Save & Exit, q: Quit');

	// Move cursor back to input line if in input mode
	if (isInputMode) {
		const linesToMoveUp = terminalHeight - inputLine - 1;
		process.stdout.write(`\x1B[${linesToMoveUp}A`);
	}
}

// Create a new task
function createTask(text) {
	if (text.trim()) {
		todos.push({ text: text.trim(), completed: false });
	}
	isInputMode = false;
	inputBuffer = '';
	displayTodos();
}

// Mark task as complete
function markComplete() {
	if (todos[selectedIndex]) {
		todos[selectedIndex].completed = !todos[selectedIndex].completed;
	}
	displayTodos();
}

// Delete task
function deleteTask() {
	if (todos[selectedIndex]) {
		todos.splice(selectedIndex, 1);
		if (selectedIndex >= todos.length && todos.length > 0) {
			selectedIndex = todos.length - 1;
		}
	}
	displayTodos();
}

// Enable raw mode for immediate key detection
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

// Handle keypress events
process.stdin.on('keypress', (char, key) => {
	if (key && key.ctrl && key.name === 'c') {
		rl.close();
		return;
	}

	if (isInputMode) {
		if (key && key.name === 'return') {
			createTask(inputBuffer);
		} else if (key && key.name === 'backspace') {
			inputBuffer = inputBuffer.slice(0, -1);
			displayTodos();
		} else if (key && key.name === 'escape') {
			isInputMode = false;
			inputBuffer = '';
			displayTodos();
		} else if (char && !key.ctrl && !key.meta) {
			inputBuffer += char;
			displayTodos();
		}
		return;
	}

	// Handle navigation and actions
	if (key && key.name === 'up') {
		selectedIndex = Math.max(0, selectedIndex - 1);
		displayTodos();
	} else if (key && key.name === 'down') {
		selectedIndex = Math.min(todos.length - 1, selectedIndex + 1);
		displayTodos();
	} else if (char === 'n') {
		isInputMode = true;
		inputBuffer = '';
		displayTodos();
	} else if (char === ' ') {
		markComplete();
	} else if (char === 'd') {
		deleteTask();
	} else if (char === 's') {
		saveTodos();
		rl.close();
	} else if (char === 'q') {
		rl.close();
	}
});

// Prevent default terminal behavior for arrow keys
process.stdin.on('data', (data) => {
	const str = data.toString();
	if (str === '\u001b[A' || str === '\u001b[B') {
		// Ignore up/down arrow key default behavior
	}
});

// Start the app
function start() {
	loadTodos();
	displayTodos();
}

// Exit handler
rl.on('close', () => {
	console.log('Exiting...');
	process.exit(0);
});

// Run the app
start();
