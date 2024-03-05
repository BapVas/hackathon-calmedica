document.addEventListener('DOMContentLoaded', function() {

  const input = document.getElementById('sms-input');

  // listen enter press key, when enter is pressed, send the message via a post request. Save complete history of messages in local storage
  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const message = e.target.value;
      fetch('responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
      e.target.value = '';
    }
  });


})
