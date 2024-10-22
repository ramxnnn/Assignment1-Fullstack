const mongoose = require("mongoose");

// MongoDB connection string using environment variables
const dbUrl = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}`;

// Define event schema and model
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
}, { collection: "events" });

// Define venue schema and model
const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  amenities: { type: String },
}, { collection: "venues" });

const Event = mongoose.model("events", eventSchema);
const Venue = mongoose.model("venues", venueSchema);

// Connect to MongoDB
async function connect() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

// Add some sample data if collections are empty
async function initializeData() {
  await connect();

  const events = [
    {
      title: "Community Picnic",
      date: new Date("2024-05-01"),
      location: "Central Park",
      description: "A fun day with games, food, and activities for everyone."
    },
    {
      title: "Tech Conference",
      date: new Date("2024-06-15"),
      location: "Convention Center",
      description: "Tech enthusiasts and experts sharing knowledge."
    }
  ];

  const venues = [
    {
      name: "Convention Center",
      address: "123 Main St, Cityville",
      capacity: 500,
      amenities: "WiFi, AV equipment, Catering services"
    },
    {
      name: "Central Park",
      address: "456 Park Ave, Cityville",
      capacity: 1000,
      amenities: "Outdoor space, Picnic areas, Playground"
    }
  ];

  await Event.insertMany(events);
  await Venue.insertMany(venues);
}

// Get all events from the database, sorted by date
async function getEvents() {
  await connect(); // Make sure we're connected
  return await Event.find({}).sort({ date: 1 }); // Get events sorted by date
}

// Get all venues from the database, sorted by name
async function getVenues() {
  await connect(); // Make sure we're connected
  return await Venue.find({}).sort({ name: 1 }); // Get venues sorted by name
}

// Add a new event to the database
async function addEvent(title, date, location, description) {
  await connect();
  const event = new Event({ title, date, location, description });
  await event.save(); // Save event to the database
  return event; // Return the saved event
}

// Add a new venue to the database
async function addVenue(name, address, capacity, amenities) {
  await connect();
  const venue = new Venue({ name, address, capacity, amenities });
  await venue.save(); // Save venue to the database
  return venue; // Return the saved venue
}

// Export these functions for use elsewhere
module.exports = {
  initializeData,  // Initialize data with sample events and venues
  getEvents,       // Fetch all events
  getVenues,       // Fetch all venues
  addEvent,        // Add a new event
  addVenue         // Add a new venue
};
