'use strict';

// Globals go here
const test = document.getElementById('testSite');
const form = document.querySelector('form');
const displayTrip = document.getElementById('displayCountdown');
const navBar = document.getElementById('mainNav');
const destinationHeader = document.getElementById('destinationHeader');
let userData = [];
let trips = [];
let tripDestination;

//This function gets todays date and time
function getDate() {
  let now = new Date();
  let todaysDate = now.toDateString();
  let todaysTime = now.toLocaleTimeString();
  test.innerHTML = `${todaysDate} ${todaysTime}`;
}

// Constructor function to make the trip.  Add more in the future?
let Trip = function(destination, start, end, duration) {
  this.destination = destination;
  this.tripStart = start;
  this.tripEnd = end;
  this.tripDuration = duration;
};

// function setCounter() {
//   let days = tripDetails[3];
//   let p = document.createElement('p');
//   p.textContent = days;
//   document.getElementById('counter').appendChild(p);
// }

// This takes in the user data to collect destination, trip start and trip end.
function handleSubmit(e) {
  e.preventDefault();
  let destination = e.target.destination.value;
  tripDestination = destination;
  console.log(destination, tripDestination);
  let startDate = new Date(e.target.startDate.value);
  let endDate = new Date(e.target.endDate.value);
  userData.push(destination, startDate, endDate);
  makeTrip();
}

//This takes in the user data to make a new instance of the Trip object.
function makeTrip() {
  let destination = userData[0];
  let startDate = userData[1];
  let endDate = userData[2];
  let tripDuration = Math.floor((endDate.getTime() - startDate.getTime()) / (1000*60*60*24));
  let newTrip = new Trip(destination, startDate, endDate, tripDuration);
  trips.push(newTrip);
  packItems(trips, destination);
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
}

//Function to adjust to current time zone from UTC time.
function adjustTimeZone(date) {
  return date.getTimezoneOffset() * 60 * 1000;
}

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
    // setCounter();
  } else {
    console.log('no trip brah');
  }
}

// Simple call back function to add/remove trip.
function handleClick(event) {
  if (event.target.id === 'clearTrip') {
    tripDestination = trips[0].destination;
    localStorage.removeItem(tripDestination);
    location.reload();
  } else if (event.target.id === 'addTrip') {
    form.className = 'visibleForm';
  }
}

// Event listeners and executable code go here.

unpackItems('Santa Marta');

setInterval(getDate, 1000);

form.addEventListener('submit', handleSubmit);
navBar.addEventListener('click', handleClick);
