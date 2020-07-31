import './index.styl'

// function copyToClipboard(text) {
//   const input = document.createElement('input')
//   input.style.position = 'fixed'
//   input.style.opacity = 0
//   input.value = text
//   document.body.appendChild(input)
//   input.select()
//   document.execCommand('Copy')
//   document.body.removeChild(input)
// }

function sendCommand(command, data, callback) {
  chrome.runtime.sendMessage({"command": command, "data": data}, callback);
}

chrome.runtime.onMessage.addListener(function(msg) {
  // If the received message has the expected format...
  if (msg && msg.command) {
    switch (msg.command) {
      case 'getToken':
        sendCommand("tokenIsHere",JSON.parse(localStorage.User));
        break;
      case 'drafts':

        break;
    }
  }
})
