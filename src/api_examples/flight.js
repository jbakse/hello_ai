// this example is unfinished.
// looks like aviationapi.com is not working right now

console.log("Hello, Flights!");

let airport = "JFK";
let url = `https://api.aviationapi.com/v1/airports?apt=${airport}&key=xyz`;
let response = await fetch(url);
let data = await response.json();
console.log(data);
console.log(data.JFK[0].facility_name);
