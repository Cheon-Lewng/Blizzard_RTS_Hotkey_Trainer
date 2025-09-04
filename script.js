fetch('./datahotkeys.json')
    .then(response => response.json())
    .then(data => {
        // Store your loaded data here
        console.log(data);
    })
    .catch(error => console.error('Error loading data:', error));