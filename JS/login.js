
fetch('/JSON/users.json')
    .then(response => response.json())
    .then(users => {
        console.log('Users loaded:', users);
        // Example of how you might use the data:
        // Validate login here using users data
    })
    .catch(error => console.error('Error loading users:', error));

