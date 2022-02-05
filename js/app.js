'use strict';

const test = document.getElementById('testSite');
const form = document.querySelector('form');
// const displayTrip = document.getElementById('tripInfo');
const navBar = document.getElementById('mainNav');
let userData = [];
let trips = [];

function getDate() {
  let now = new Date();
  let todaysDate = now.toDateString();
  let todaysTime = now.toLocaleTimeString();
  test.innerHTML = `${todaysDate} ${todaysTime}`;
}

let Trip = function(destination, start, end, duration, days, hours, minutes, seconds) {
  this.destination = destination;
  this.tripStart = start;
  this.tripEnd = end;
  this.tripDuration = duration;
  this.daysUntil = days;
  this.hoursUntil = hours;
  this.minutesUntil = minutes;
  this.secondsUntil = seconds;
};

// function setCounter() {
//   let days = tripDetails[3];
//   let p = document.createElement('p');
//   p.textContent = days;
//   document.getElementById('counter').appendChild(p);
// }

function handleSubmit(e) {
  e.preventDefault();
  let destination = e.target.destination.value;
  let startDate = new Date(e.target.startDate.value);
  let endDate = new Date(e.target.endDate.value);
  userData.push(destination, startDate, endDate);
  countDown();
}

function countDown() {
  let destination = userData[0];
  let startDate = userData[1];
  let endDate = userData[2];
  let today = new Date().getTime();
  let startDiff = adjustTimeZone(startDate);
  let tripStart = startDate.getTime() + startDiff;
  let endDiff = adjustTimeZone(endDate);
  let tripEnd = endDate.getTime() + endDiff;
  let daysUntil = Math.floor((tripStart - today) / (1000*60*60*24));
  let hoursUntil = Math.floor(((tripStart - today) % (1000*60*60*24)) / (1000*60*60));
  let minutesUntil = Math.floor(((tripStart - today) % (1000*60*60)) / (1000*60));
  let secondsUntil = Math.floor(((tripStart - today) % (1000*60)) / 1000);
  let tripDuration = Math.floor((tripEnd - tripStart) / (1000*60*60*24));
  let newTrip = new Trip(destination, startDate, endDate, tripDuration, daysUntil, hoursUntil, minutesUntil, secondsUntil);
  trips.push(newTrip);
  packItems(trips, destination);
  console.log(trips);
}

function adjustTimeZone(date) {
  return date.getTimezoneOffset() * 60 * 1000;
}

function packItems(items, key) {
  let stringyItems = JSON.stringify(items);
  localStorage.setItem(key, stringyItems);
}

// function unpackItems() {
  //   let unpackedDeets = localStorage.getItem('details');
//   if (unpackedDeets) {
//     let parsedDeets = JSON.parse(unpackedDeets);
//     tripDetails = parsedDeets;
//     setCounter();
//   }
// }

function handleClick(event) {
  if (event.target.id === 'clearTrip') {
    localStorage.removeItem('details');
    location.reload();
  } else if (event.target.id === 'addTrip') {
    form.className = 'visibleForm';
  }
}

// unpackItems();

setInterval(getDate, countDown, 1000);

form.addEventListener('submit', handleSubmit);
navBar.addEventListener('click', handleClick);
