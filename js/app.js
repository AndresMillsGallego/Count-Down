'use strict';

// Globals go here
const clock = document.getElementById('dateAndTime');
const form = document.querySelector('form');
const displayTrip = document.getElementById('displayCountdown');
const navBar = document.getElementById('mainNav');
const destinationHeader = document.getElementById('destinationHeader');
let userData = [];
let trips = [];
let tripKeys = ['trip1', 'trip2', 'trip3', 'trip4'];
let tripCounter = 0;
// let message;

//This function gets todays date and time
function getDate() {
  clock.innerHTML = '';
  let now = new Date();
  let todaysDate = now.toDateString();
  let todaysTime = now.toLocaleTimeString();
  renderClock(todaysDate, todaysTime);
}

// This function renders the date and time for the header clock.
function renderClock(date, time) {
  let dayDiv = document.createElement('div');
  dayDiv.textContent = date;
  let timeDiv = document.createElement('div');
  timeDiv.textContent = time;
  clock.appendChild(dayDiv);
  clock.appendChild(timeDiv);
}

// Constructor function to make the trip.  Add more in the future?
let Trip = function(destination, start, end, duration) {
  this.destination = destination;
  this.tripStart = start;
  this.tripEnd = end;
  this.tripDuration = duration;
};

// This function sets the "days left" to the plane counter in the header.
function setCounter(days) {
  let counterDiv = document.getElementById('counter');
  counterDiv.innerHTML = '';
  let dayCounter = days;
  let p = document.createElement('p');
  p.textContent = dayCounter + 'd';
  counterDiv.appendChild(p);
}

// This takes in the user data to collect destination, trip start and trip end.
function handleSubmit(e) {
  e.preventDefault();
  // unpackCounter();
  let destination = e.target.destination.value;
  let startDate = new Date(e.target.startDate.value);
  let endDate = new Date(e.target.endDate.value);
  if (endDate > startDate) {
    userData.push(destination, startDate, endDate);
    makeTrip();
    tripCounter++;
    packItems(tripCounter, 'tripCounter');
  } else {
    alert('The end date needs to be after the start date.  Please enter new dates.');
    form.reset();
  }
}

//This takes in the user data to make a new instance of the Trip object.
function makeTrip() {
  let destination = userData[0];
  let startDate = userData[1];
  let endDate = userData[2];
  let tripDuration = Math.floor((endDate.getTime() - startDate.getTime()) / (1000*60*60*24));
  let newTrip = new Trip(destination, startDate, endDate, tripDuration);
  trips.push(newTrip);
  packItems(trips, tripKeys[tripCounter]);
  userData = [];
  location.reload();
}

// This is the code that actually counts down to the day you leave on the trip!
function countDown() {
  displayTrip.innerHTML = '';
  destinationHeader.innerHTML = '';
  let today = new Date().getTime();
  let tripBegins = trips[0].tripStart;
  let startDate = new Date(tripBegins);
  let startDiff = adjustTimeZone(startDate);
  let tripStart = startDate.getTime() + startDiff;
  let daysUntil = Math.floor((tripStart - today) / (1000*60*60*24));
  let hoursUntil = Math.floor(((tripStart - today) % (1000*60*60*24)) / (1000*60*60));
  let minutesUntil = Math.floor(((tripStart - today) % (1000*60*60)) / (1000*60));
  let secondsUntil = Math.floor(((tripStart - today) % (1000*60)) / 1000);
  renderCountDown(daysUntil, hoursUntil, minutesUntil, secondsUntil);
}

// This renders the days, hours, minutes and seconds till the trip.  It is called in the countDown function so that it constantly renders as it is updated.
function renderCountDown(days, hours, minutes, seconds) {
  let h2 = document.createElement('h2');
  h2.textContent = trips[0].destination + '!';
  destinationHeader.appendChild(h2);
  let dayDiv = document.createElement('div');
  dayDiv.textContent = days + 'd';
  let hourDiv = document.createElement('div');
  hourDiv.textContent = hours + 'h';
  let minuteDiv = document.createElement('div');
  minuteDiv.textContent = minutes + 'm';
  let secondDiv = document.createElement('div');
  secondDiv.textContent = seconds + 's';
  displayTrip.appendChild(dayDiv);
  displayTrip.appendChild(hourDiv);
  displayTrip.appendChild(minuteDiv);
  displayTrip.appendChild(secondDiv);
  setCounter(days);
}

//Function to adjust to current time zone from UTC time.
function adjustTimeZone(date) {
  return date.getTimezoneOffset() * 60 * 1000;
}

//Function that makes a button.
// function renderMessage() {
//   let unpackedMessage = localStorage.getItem('tripMessage');
//   let parsedMessage = JSON.parse(unpackedMessage);
//   let messageDiv = document.getElementById('message');
//   let p = document.createElement('p');
//   p.textContent = parsedMessage;
//   messageDiv.appendChild(p);
// }

//Packs things away to localStorage.  Items are for the items to pack, key is for the key.
function packItems(items, key) {
  let stringyItems = JSON.stringify(items);
  localStorage.setItem(key, stringyItems);
}

// Unpacks the data for the trip.
function unpackItems(key) {
  let unpackedDeets = localStorage.getItem(key);
  if (unpackedDeets) {
    let parsedDeets = JSON.parse(unpackedDeets);
    trips = parsedDeets;
    countDown();
    displayTrip.className = 'visibleDisplay';
    setInterval(countDown, 1000);
  } else {
    console.log('no trip brah');
  }
}

// function unpackCounter() {
//   let unpackedCounter = localStorage.getItem('tripCounter');
//   if (unpackedCounter) {
//     let parsedCounter = JSON.parse(unpackedCounter);
//     tripCounter = parsedCounter;
//     console.log(tripCounter);
//   } else {
//     tripCounter = 0;
//   }
// }

// Simple call back function to add/remove trip.
function handleClick(event) {
  if (event.target.id === 'clearTrip') {
    localStorage.removeItem(tripKeys[tripCounter]);
    tripCounter = 0;
    location.reload();
  } if (event.target.id === 'addTrip') {
    form.className = 'visibleForm';
  }
}

// Event listeners and executable code go here.

console.log(tripCounter);

unpackItems(tripKeys[0]);

setInterval(getDate, 1000);

form.addEventListener('submit', handleSubmit);
navBar.addEventListener('click', handleClick);
