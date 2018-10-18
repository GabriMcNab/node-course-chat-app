const socket = io();

socket.on('connect', function () {
  console.log('connected to server!');
});

socket.on('disconnect', function () {
  console.log('disconnected from server');
});

socket.on('newMessage', function (message) {
  const fromattedTime = moment(message.createdAt).format('h:mm a');
  const li = $('<li></li>');
  li.text(`${message.from} ${fromattedTime}: ${message.text}`);

  $('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  const fromattedTime = moment(message.createdAt).format('h:mm a');
  const li = $('<li></li>');
  const a = $('<a target="_blank">My current location</a>');

  li.text(`${message.from} ${fromattedTime}: `);
  a.attr('href', message.url);
  li.append(a);

  $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();

  const messageTextbox = $('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('');
  });
});

const locationButton = $('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    alert('Geolocation not supported by your browser')
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled');
    alert('Unable to fetch location').text('Send Location');
  });
});