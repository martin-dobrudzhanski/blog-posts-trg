var form = document.getElementById('form1');

form.addEventListener('submit', function () {
	parent.postMessage({
		eventType: 'submit'
	}, '*');
});

window.addEventListener('message', function (event) {
	if (event.data.eventType !== 'complete')  {
		return;
	}
	parent.postMessage({
		eventType: 'complete',
		bookingInfo: event.data.bookingInfo
	}, '*');
});
