const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// Load up the .env file
dotenv.config();

const db = require("./modules/db"); // Bring in db.js to handle event and venue stuff

// Set up the Express app
const app = express();
const port = process.env.PORT || "8888";

// Configure Pug as our view engine
app.set("views", path.join(__dirname, "views")); // Folder for Pug files
app.set("view engine", "pug");

// Set the public folder for static files (like CSS)
app.use(express.static(path.join(__dirname, "public")));

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Route to display events and venues on the homepage
app.get("/", async (request, response) => {
  const eventList = await db.getEvents();  // Fetch events from the database
  const venueList = await db.getVenues();  // Fetch venues from the database

  if (!eventList.length || !venueList.length) {
    await db.initializeData();  // Load some default data if the database is empty
  }

  // Render the homepage with the fetched data
  response.render("index", { events: eventList, venues: venueList });
});

// Route to add a new event
app.post("/add-event", async (request, response) => {
  const { title, date, location, description } = request.body;  // Grab event details from the form
  const newEvent = await db.addEvent(title, date, location, description);  // Add event to the database
  response.json({ message: "Event added successfully", event: newEvent });  // Respond with a success message
});

// Route to add a new venue
app.post("/add-venue", async (request, response) => {
  const { name, address, capacity, amenities } = request.body;  // Grab venue details from the form
  const newVenue = await db.addVenue(name, address, capacity, amenities);  // Add venue to the database
  response.json({ message: "Venue added successfully", venue: newVenue });  // Respond with a success message
});

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
