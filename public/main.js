// Initialize variables
var $window = $(window);
var $usernameInput = $('.usernameInput'); // Input for username
var $messages = $('.messages'); // Messages area
var $inputMessage = $('.inputMessage'); // Input message input box

var $loginPage = $('.login.page'); // The login page
var $chatPage = $('.chat.page'); // The chatroom page

var $delB = $('.delB'); //delete button
var $updateB = $('.updateB'); //update button
var $listB = $('.listB'); //all list show button
// Prompt for setting a username
var $currentInput = $usernameInput.focus();
var username;
var connected = false;

var socket = io();

// Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
  }

// Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();

    // Prevent markup from being injected into the message
    message = cleanInput(message);

    // if there is a non-empty message and a socket connection
    if (message && connected) {

      $inputMessage.val('');
      addChatMessage({
      username: username,
      message: message
    });

      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Prevents input from having injected markup
    function cleanInput (input) {
      return $('<div/>').text(input).text();
    }

  // Log a message
    function log (message, options) {
      var $el = $('<li>').addClass('log').text(message);
      addMessageElement($el, options);
    }

    // Adds the visual chat message to the message list
    function addChatMessage (data, options) {

    options = options || {};
    var msg = data.username + " : " + data.message;

    var $message = $('<li>').addClass('log').text(msg);

    addMessageElement($message, options);
    }

    // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {

    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }



// Keyboard events

    $window.keydown(function (event) {
      // Auto-focus the current input when a key is typed
      if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        $currentInput.focus();
      }
      // When the client hits ENTER on their keyboard
      if (event.which === 13) {
        if (username) {
          sendMessage();
        } else {
          setUsername();
        }
      }
    });

  // Click events
  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  $delB.click(function () {
    var message10 = "del b press";
    log(message10, {
      prepend: true
    });

    var del_m = $inputMessage.val();
    del_m = cleanInput(del_m);
    $inputMessage.val('');

    socket.emit('delete message', del_m);
  });

  $updateB.click(function () {
    var message11 = "update b press";
    log(message11, {
      prepend: true
    });

    var up_m = $inputMessage.val();

    var message13 = up_m;
    log(message13, {
      prepend: true
    });
    $inputMessage.val('');

    socket.emit('update message', up_m);
  });

$listB.click(function () {
  var message1116 = "list b press";
  log(message1116, {
    prepend: true
  });

  socket.emit('show All message');
});

  // Socket events
  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to And_DB Test– " + username;
    log(message, {
      prepend: true
    });
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  socket.on('showAll', function (docs) {
    var message1000 = docs.docs;
    log(message1000, {
      prepend: true
    });
  });
