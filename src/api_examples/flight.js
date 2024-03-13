// this example is unfinished.
// looks like aviationapi.com is not working right now

console.log("Hello, Flights!");

const airport = "JFK";
const url = `https://api.aviationapi.com/v1/airports?apt=${airport}&key=xyz`;
const response = await fetch(url);
const data = await response.json();

console.log("data:");
console.log(data);

console.log("");
console.log("data.JFK[0].facility_name:");
console.log(data.JFK[0].facility_name);
