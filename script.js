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
    const isBuildTask = Math.random() < 0.1; // 50% chance for either

    if (isBuildTask) {
        // 3. Handle a worker-building task
        const buildMenus = terranData.build_menus;
        const menuKeys = Object.keys(buildMenus);
        const randomMenuKey = menuKeys[Math.floor(Math.random() * menuKeys.length)];
        const randomMenu = buildMenus[randomMenuKey];

        // 4. Randomly select a building from that menu
        const buildingToBuild = randomMenu[Math.floor(Math.random() * randomMenu.length)];

        currentTask = {
            entity: terranData.units[0],
            command: {
                hotkey: (randomMenuKey === 'basic_structures') ? 'B' : 'V',
                // Store a reference to the actual building task
                building: buildingToBuild,
                menuImage: randomMenu.image
            }
        };

    } else {
        // 3. Handle a standard unit/building command
        const units = terranData.units;
        currentEntity = units[Math.floor(Math.random() * units.length)];
        availabiieCommands = currentEntity.commands;

        // 4. Randomly select a command from the entity's commands.
        const currentCommand = availabiieCommands[Math.floor(Math.random() * availabiieCommands.length)];
    
        // 5. Update the global currentTask variable
        currentTask = {
            entity: currentEntity,
            command: currentCommand
        };
    }

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
let isAwaitingSecondaryHotkey = false;

document.addEventListener('keydown', (event) => {
    // Get pressed key and convert it to uppercase for consistency
    const pressedKey = event.key.toUpperCase();

    if (isAwaitingSecondaryHotkey) {
        // SECONDARY KEYPRESS LOGIC
        const correctSecondaryKey = currentTask.command.secondary_hotkey.toUpperCase();

        if (pressedKey === correctSecondaryKey) {
            // Correct second keypress
            isAwaitingSecondaryHotkey = false;
            console.log('Combo complete! Correct.');
            // Provide visual feedback for a correct answer
            document.body.style.backgroundColor = 'lightgreen';
            setTimeout(() => {
                document.body.style.backgroundColor = 'white';
            }, 200);
            selectNewTask();
        } else {
            console.log('Incorrect second keypress.');
            // Provide visual feedback for an incorrect answer
            document.body.style.backgroundColor = 'red';
            setTimeout(() => {
                document.body.style.backgroundColor = 'white';
            }, 200);
        }
    } else {
    // PR
        if (currentTask && currentTask.command) {
            const correctHotkey = currentTask.command.hotkey.toUpperCase();

            if (pressedKey === correctHotkey) {
                if (currentTask.command.building) {
                    isAwaitingSecondaryHotkey = true;

                    // Change the display to the build menu card
                    document.getElementById('command-card-image').src = currentTask.command.menuImage;
                    document.getElementById('command-card-image').style.display = 'block';
                    document.getElementById('command-text').textContent = currentTask.command.building.name;
                    console.log('Correct primary keypress. Awaiting secondary hotkey.');
                } else {
                    console.log('Correct keypress.');
                    // Provide visual feedback for a correct answer
                    document.body.style.backgroundColor = 'lightgreen';
                    setTimeout(() => {
                        document.body.style.backgroundColor = 'white';
                    }, 200);
                    selectNewTask();
                }
            } else {
                console.log('Incorrect primary keypress.');
                // Provide visual feedback for an incorrect answer
                document.body.style.backgroundColor = 'red';
                setTimeout(() => {
                    document.body.style.backgroundColor = 'white';
                }, 200);
            }
        }
    }
});