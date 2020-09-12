$(document).ready(function(){
// display Date & update function every seconds-- have the correct time
displayDate();
setInterval(displayDate, 1000);

function displayDate() {
  let date = moment().format('LLLL');
  $('#currentDay').text(date);
}

// Init Work hour in a day i.e 9:00am-- this where we will start from
let hour = 9;
let hourSuffix = ':00am';

// Get stored items from local storage
var store = [];

// Display hour blocks
displayHourBlocks(9);

// Funtion to generate work hours in a day and display as bloch
// WkHoursInAday = 9 (9am - 5pm);
function displayHourBlocks(WkHoursInAday) {
  if (!WkHoursInAday) {
    WkHoursInAday = 1;
  }

  // Get Current Time from moment.js & split it to array
  let time = moment().format('LT').toLowerCase().split('');

  //Ex of time output
  //time=['3',':','4','3','p','m']

  // Get hour from time array and add suffix
  let currentTime =
    getCurrentHour(time) + ':00' + time.slice(-2)[0] + time.slice(-1)[0];

  // Ex of current time output
  // currentTime = '3:00pm';

  for (let i = 0; i < WkHoursInAday; i++) {
    var blockTime = hour + hourSuffix;

    $block = $('<div>').addClass('row py-1');

    $timeInBlock = $('<h4>').text(blockTime).addClass('text-light');
    $timeBlockDiv = $('<div>')
      .addClass('col-2 py-3 bg-dark align-middle')
      .append($timeInBlock);

    $textArea = $('<textarea>')
      .addClass('col-9 py-3 overflow-auto')
      .attr('id', blockTime);

    // Set Text Area background color
    setTextAreaBgColor($textArea, currentTime, blockTime);

    $blockSave = $('<i>').addClass('fas fa-save fa-2x save');

    $saveBlockDiv = $('<div>')
      .addClass('col-1 py-3 lock-container border border-dark')
      .append($blockSave);

    $block.append($timeBlockDiv, $textArea, $saveBlockDiv);

    $('#plan-container').append($block);

    // increment global hour;
    if (hour === 12) {
      hour = 1;
    } else if (hour === 11) {
      hourSuffix = ':00pm';
      hour++;
    } else {
      hour++;
    }
  }
}

function setTextAreaBgColor(textArea, currentTime, blockTime) {
  // Ex of current time & block time
  //current  = '3:00pm' & blockTime = '10:00am'

  var curTime = currentTime.split('');
  var bkTime = blockTime.split('');

  //currTime  = ['3',':','0','0','p,'m'] & blockTime = '10:00am'

  if (curTime[curTime.length - 2] !== bkTime[bkTime.length - 2]) {
    if (curTime[curTime.length - 2] > bkTime[bkTime.length - 2]) {
      textArea.addClass('bg-secondary');
    } else {
      textArea.addClass('bg-warning');
    }
  } else {
    // Get hour from current time and block time arrays
    var c_time = getCurrentHour(curTime);
    var b_time = getCurrentHour(bkTime);

    if (parseInt(c_time) > parseInt(b_time)) {
      textArea.addClass('bg-secondary');
    } else if (parseInt(c_time) < parseInt(b_time)) {
      if (parseInt(b_time) === 12) {
        textArea.addClass('bg-secondary');
      } else {
        textArea.addClass('bg-warning');
      }
    } else {
      $textArea.addClass('bg-danger');
    }
  }
}

function getCurrentHour(timeArray) {
  let i = 0;
  let hour = '';

  while (timeArray[i] !== ':' || i > 100) {
    hour += timeArray[i];
    i++;
  }

  return hour;
}

// Get stored information
getStoredPlans();

function getStoredPlans() {
  if (localStorage.getItem('plans')) {
    store = JSON.parse(localStorage.getItem('plans'));

    store.forEach(block => {
      id = '#' + block.id;

      // $block = $(`#${block.id}`);
      $block = $(document.getElementById(block.id));

      $block.val(block.input);

      $save = $($block.parent().children().children()[1]);
    });
  }
}

// Get save button & save plan
$('.save').on('click', function () {
  $textArea = $($(this).parent().parent().children()[1]);

  input = $textArea.val();
  id = $textArea.attr('id');

  block = {
    id: id,
    input: input.trim(),
  };

  for (let i = 0; i < store.length; i++) {
    if (store[i].id === block.id) {
      store.splice(i, 1);

      localStorage.setItem('plans', JSON.stringify(store));
    }
  }

  store.push(block);

  localStorage.setItem('plans', JSON.stringify(store));
});
});
