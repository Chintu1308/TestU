document.addEventListener('DOMContentLoaded', async function() {
    const playbackEditor = document.getElementById('playback-editor');
  
    // Extract student ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('studentId');
  
    // Fetch keystrokes from backend
    const response = await fetch(`/api/playback/${studentId}`);
    const keystrokes = await response.json();
  
    // Playback keystrokes in sequence
    keystrokes.forEach((keystroke, index) => {
      setTimeout(() => {
        playbackEditor.innerHTML = keystroke.input;
      }, index * 100); // Adjust the timing based on desired playback speed
    });
  });
  