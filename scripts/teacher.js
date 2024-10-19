document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('teacher-form');
  const numQuestionsInput = document.getElementById('num-questions');
  const questionsContainer = document.getElementById('questions-container');

  numQuestionsInput.addEventListener('change', function() {
    const numQuestions = parseInt(numQuestionsInput.value);
    questionsContainer.innerHTML = ''; // Clear previous questions

    for (let i = 1; i <= numQuestions; i++) {
      const div = document.createElement('div');
      div.classList.add('form-group');

      const label = document.createElement('label');
      label.textContent = `Question ${i}:`;
      div.appendChild(label);

      const textarea = document.createElement('textarea');
      textarea.name = `question${i}`;
      textarea.rows = 3;
      textarea.required = true;
      div.appendChild(textarea);

      questionsContainer.appendChild(div);
    }
  });

  form.addEventListener('submit', async function(event) {
  event.preventDefault();
  const questions = Array.from(questionsContainer.querySelectorAll('textarea')).map(textarea => textarea.value);

  const response = await fetch('http://localhost:3000/api/create-questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ teacherName: 'Teacher', questions })
  });

  const data = await response.json();
  alert(`Link created: ${data.link}`);
});

});
