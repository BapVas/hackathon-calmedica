function formatDateToHumanReadable(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
}

function getMessages() {
  // get the history of messages from local storage and display them
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  const messagesList = document.getElementById('messages-list');
  messagesList.innerHTML = messages
    .map(
      (message) => `
<li class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
  <div>
    <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
      <p class="text-sm">${message.content}</p>
    </div>
    <span class="text-xs text-gray-500 leading-none">${formatDateToHumanReadable(message.date)}</span>
  </div>
  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
    <img src="https://placehold.co/600/black/white?text=AI" alt="avatar" class="h-10 w-10 rounded-full" />
  </div>
</li>`,
    )
    .join('');
}

function deleteResponse(id) {
  if (confirm('Are you sure you want to delete this response?') === false) {
    return;
  }

  fetch(`responses/${id}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then(() => {
      const messages = JSON.parse(localStorage.getItem('messages')) || [];
      const newMessages = messages.filter((message) => message.id !== id);
      localStorage.setItem('messages', JSON.stringify(newMessages));
      window.location.reload();
    });
}

function addInputEvent() {
  const input = document.getElementById('sms-input');

  if (!input) {
    return;
  }

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
          const messages = JSON.parse(localStorage.getItem('messages')) || [];
          messages.push(data);
          localStorage.setItem('messages', JSON.stringify(messages));

          getMessages();
        });
      e.target.value = '';
    }
  });

  getMessages();
}

function addButtonEvent() {
  const button = document.getElementById('delete-conversation');
  button.addEventListener('click', function () {
    if (
      confirm('Are you sure you want to delete this conversation?') === false
    ) {
      return;
    }

    localStorage.removeItem('messages');
    getMessages();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  addInputEvent();
  addButtonEvent();
});
