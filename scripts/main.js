document.addEventListener('DOMContentLoaded', function() {
    var editor = document.getElementById('editor');
    var storageKey = 'keystrokes_data';
    var syncInterval = 5000; // Sync every 5 seconds
  
    editor.addEventListener('input', function() {
      var timestamp = new Date().toISOString();
      var inputValue = editor.innerHTML;
      
      // Capture and store keystroke locally
      var keystrokes = JSON.parse(localStorage.getItem(storageKey)) || [];
      keystrokes.push({input: inputValue, time: timestamp});
      localStorage.setItem(storageKey, JSON.stringify(keystrokes));
    });
  
    // Periodically sync data to backend
    setInterval(function() {
      var keystrokes = JSON.parse(localStorage.getItem(storageKey)) || [];
      if (keystrokes.length > 0) {
        fetch('/save-keystrokes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(keystrokes)
        })
        .then(response => response.json())
        .then(data => {
          console.log('Sync Success:', data);
          localStorage.setItem(storageKey, JSON.stringify([])); // Clear local storage after sync
        })
        .catch((error) => {
          console.error('Sync Error:', error);
        });
      }
    }, syncInterval);
  
    // Final sync on form submission
    document.getElementById('student-form').addEventListener('submit', function(event) {
      event.preventDefault();
      var keystrokes = JSON.parse(localStorage.getItem(storageKey)) || [];
      
      fetch('/save-keystrokes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(keystrokes)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Final Sync Success:', data);
        localStorage.setItem(storageKey, JSON.stringify([])); // Clear local storage
        // Redirect to the questions page or confirmation page
        window.location.href = "/questions.html";
      })
      .catch((error) => {
        console.error('Final Sync Error:', error);
      });
    });
  });
  