document.addEventListener('DOMContentLoaded', async function() {
    const questionContainer = document.getElementById('question-container');
    const editor = document.getElementById('editor');
    const storageKey = 'keystrokes_data';
    const syncInterval = 5000; // Sync every 5 seconds
  
    // Extract question ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('id');
  
    // Fetch questions from backend
    const response = await fetch(`/api/questions/${questionId}`);
    const data = await response.json();
  
    data.questions.forEach((question, index) => {
      const div = document.createElement('div');
      div.classList.add('question-block');
  
      const questionLabel = document.createElement('h2');
      questionLabel.textContent = `Question ${index + 1}`;
      div.appendChild(questionLabel);
  
      const questionText = document.createElement('p');
      questionText.textContent = question;
      div.appendChild(questionText);
  
      questionContainer.appendChild(div);
    });
  
    // Capture and store keystrokes
    editor.addEventListener('input', function() {
      const timestamp = new Date().toISOString();
      const inputValue = editor.innerHTML;
  
      const keystrokes = JSON.parse(localStorage.getItem(storageKey)) || [];
      keystrokes.push({ input: inputValue, time: timestamp });
      localStorage.setItem(storageKey, JSON.stringify(keystrokes));
    });
  
    // Periodically sync data to backend
    setInterval(function() {
      const keystrokes = JSON.parse(localStorage.getItem(storageKey)) || [];
      if (keystrokes.length > 0) {
        fetch('/api/save-keystrokes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(keystrokes)
        })
        .then(response => response.json())
        .then(data => {
          console.log('Sync Success:', data);
          localStorage.setItem(storageKey, JSON.stringify([]));
        })
        .catch((error) => {
          console.error('Sync Error:', error);
        });
      }
    }, syncInterval);
  
    // Final sync on form submission
    document.getElementById('student-form').addEventListener('submit', function(event) {
      event.preventDefault();
      const keystrokes = JSON.parse(localStorage.getItem(storageKey)) || [];
  
      fetch('/api/save-keystrokes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(keystrokes)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Final Sync Success:', data);
        localStorage.setItem(storageKey, JSON.stringify([]));
        alert('Answers submitted successfully!');
      })
      .catch((error) => {
        console.error('Final Sync Error:', error);
      });
    });
  });
  