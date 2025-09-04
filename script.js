let gameData;
let currentTask = {}; // This will hold the current unit/command being trained

const unitImage = document.getElementById('unit-image');
const commandText = document.getElementById('command-text');
const commandCardImage = document.getElementById('command-card-image');
const accuracyStat = document.getElementById('accuracy');
const speedStat = document.getElementById('speed');
// Add variables for any other elements you want to manipulate

// 1. Data Loading
fetch('./datahotkeys.json')
    .then(response => response.json())
    .then(data => {
        gameData = data;
        console.log('Data loaded:', gameData);
        // Call a function to initialize the trainer here
        initializeTrainer();
    })
    .catch(error => console.error('Error loading hotkey data:', error));

// 2. Initialization and Game Loop
function initializeTrainer() {
    console.log('Trainer initialized. Starting new session.');
    
    // Reset any stats from a previous session
    let masteryData = {};
    localStorage.setItem('masteryData', JSON.stringify(masteryData));

    selectNewTask(); // Call the function to display the first task
}

function selectNewTask() {
    // 1. Get the Terran data from your loaded JSON
    const terranData = gameData.starcraftBW.terran;
    
    // 2. Randomly decide whether to prompt with a unit or building.
    const isBuildingTask = Math.random() < 0.5; // 50% chance for either

    let currentEntity;
    let availabiieCommands;

    if (isBuildingTask) {
        // 3. Select a random building.
        const buildings = terranData.buildings;
        currentEntity = buildings[Math.floor(Math.random() * buildings.length)];
        availabiieCommands = currentEntity.commands;
    } else {
        // 3. Select a random unit.
        const units = terranData.units;
        currentEntity = units[Math.floor(Math.random() * units.length)];
        availabiieCommands = currentEntity.commands;
    }

    // 4. Randomly select a command from the entity's commands.
    const currentCommand = availabiieCommands[Math.floor(Math.random() * availabiieCommands.length)];
    
    // 5. Update the global currentTask variable
    currentTask = {
        entity: currentEntity,
        command: currentCommand
    };

    // 6. Display the task on the GUI
    displayTask();
}

function displayTask() {
    // Get references to your HTML elements
    const unitImage = document.getElementById('unit-image');
    const commandText = document.getElementById('command-text');
    const commandCardImage = document.getElementById('command-card-image');
    
    // Display the entity image (unit or building)
    unitImage.src = currentTask.entity.image;

    // Display the command name
    commandText.textContent = currentTask.command.name;

    // Check for a command card image and display it if it exists
    if (currentTask.command.command_card) {
        commandCardImage.src = currentTask.command.command_card;
        commandCardImage.style.display = 'block'; // Make sure the image is visible
    } else {
        commandCardImage.style.display = 'none'; // Hide the command card if not applicable
    }
}

// 3. User Input
document.addEventListener('keydown', (event) => {
    // Get pressed key and convert it to uppercase for consistency
    const pressedKey = event.key.toUpperCase();

    // Make sure there is a task to validate against
    if (currentTask && currentTask.command) {
        // Get the hotkey from the current task
        const correctHotkey = currentTask.command.hotkey.toUpperCase();

        // Check if the user's key matches the correct hotkey
        if (pressedKey === correctHotkey) {
            console.log('Correct key pressed!');
            // Provide visual feedback for a correct answer
            document.body.style.backgroundColor = 'lightgreen';
            setTimeout(() => {
                document.body.style.backgroundColor = 'white';
            }, 200);

            // Select the next task to continue the training session
            selectNewTask(); // Call the function to display the next task
        } else {
            console.log('Incorrect key pressed. Try again.');
            // Provide visual feedback for an incorrect answer
            document.body.style.backgroundColor = 'red';
            setTimeout(() => {
                document.body.style.backgroundColor = 'white';
            }, 200);
        }
    }
});