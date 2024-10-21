const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// Load the environment variables from .env
dotenv.config();

const db = require("./modules/db"); // Load db.js with event and venue functions

// Set up the Express app
const app = express();
const port = process.env.PORT || "8888";

// Set up application template engine
app.set("views", path.join(__dirname, "views")); // Path to views
app.set("view engine", "pug");

// Set up folder for static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Home route to display events and venues
app.get("/", async (request, response) => {
  const eventList = await db.getEvents();  // Get list of events
  const venueList = await db.getVenues();  // Get list of venues

  if (!eventList.length || !venueList.length) {
    await db.initializeData();  // Initialize data if empty
  }

  response.render("index", { events: eventList, venues: venueList });
});

// Route to add an event
app.post("/add-event", async (request, response) => {
  const { title, date, location, description } = request.body;  // Get data from form
  const newEvent = await db.addEvent(title, date, location, description);  // Add event to DB
  response.json({ message: "Event added successfully", event: newEvent });  // Return JSON response
});

// Route to add a venue
app.post("/add-venue", async (request, response) => {
  const { name, address, capacity, amenities } = request.body;  // Get data from form
  const newVenue = await db.addVenue(name, address, capacity, amenities);  // Add venue to DB
  response.json({ message: "Venue added successfully", venue: newVenue });  // Return JSON response
});

// Set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
