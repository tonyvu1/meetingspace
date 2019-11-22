/* global flatpickr */

window.addEventListener('load', function () {

  flatpickr('.start_date_input', {
    enableTime: true,
    defaultDate: new Date(Date.now() + 300000),
    minDate: new Date(Date.now() + 60000),
    altInput: true,
    altFormat: 'h:i K, M j, Y',
    dateFormat: 'Z'
  });

});



/* Default time is tomorrow */

/* window.addEventListener('load', function () {
  var date = new Date();
  var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  var tomorrow = new Date(date.getFullYear(), date.getMonth(), (date.getDate() + 1));
  var end = new Date(date.getFullYear(), date.getMonth(), (date.getDate() + 1));

  flatpickr('.start_date_input', {
    enableTime: true,
    defaultDate: tomorrow,
    minDate: new Date(Date.now() + 60000000),
    maxDate: '2019-11-28T01:01:01.000Z',
    altInput: true,
    altFormat: 'h:i K, M j, Y',
    dateFormat: 'Z',
    minuteIncrement: 30
  });

});
 */