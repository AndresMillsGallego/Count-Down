'use strict';

const test = document.getElementById('testSite');
const form = document.querySelector('form');
const displayTrip = document.getElementById('tripInfo');
let tripDetails = [];

function getDate() {
  let now = new Date();
  let todaysDate = now.toDateString();
  let todaysTime = now.toLocaleTimeString();
  test.innerHTML = `${todaysDate} ${todaysTime}`;
}

function setCounter() {
  let days = tripDetails[3];
  let p = document.createElement('p');
  p.textContent = days;
  document.getElementById('counter').appendChild(p);
}

function handleSubmit(e) {
  e.preventDefault();
  let destination = e.target.destination.value;
  let startDate = new Date(e.target.startDate.value);
  let endDate = new Date(e.target.endDate.value);
  tripDetails.push(destination, startDate, endDate);
  countDown();
}

function countDown() {
  let destination = tripDetails[0];
  let today = new Date().getTime();
  let startDiff = adjustTimeZone(tripDetails[1]);
  let tripStart = tripDetails[1].getTime() + startDiff;
  let endDiff = adjustTimeZone(tripDetails[2]);
  let tripEnd = tripDetails[2].getTime() + endDiff;
  let daysUntilTrip = Math.floor((tripStart - today)/1000/60/60/24);
  let tripDuration = Math.floor((tripEnd - tripStart)/1000/60/60/24);
  tripDetails.push(daysUntilTrip, tripDuration);
  let message = `Congratulations!  You are travelling to ${destination}!  Your trip begins in ${daysUntilTrip} days.  You will be spending ${tripDuration} glorious days there!`;
  displayTrip.innerHTML = message;
  packItems();
  setCounter();
  console.log(today);
  console.log(tripDetails);
}

function adjustTimeZone(date) {
  return date.getTimezoneOffset() * 60 * 1000;
}

function packItems() {
  let stringyDeets = JSON.stringify(tripDetails);
  localStorage.setItem('details', stringyDeets);
}

setInterval(getDate, 1000);
form.addEventListener('submit', handleSubmit);
