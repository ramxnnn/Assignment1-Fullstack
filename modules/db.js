const mongoose = require("mongoose");

// Connection URL for MongoDB (using environment variables)
const dbUrl = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}`;

// Define Schemas and Models
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
}, { collection: "events" });

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  amenities: { type: String },
}, { collection: "venues" });

const Event = mongoose.model("events", eventSchema);
const Venue = mongoose.model("venues", venueSchema);

// MongoDB Functions
async function connect() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

// Function to initialize collections with sample data
async function initializeData() {
  await connect();

  const events = [
    {
      title: "Community Picnic",
      date: new Date("2024-05-01"),
      location: "Central Park",
      description: "A fun-filled day with games, food, and activities for the whole family."
    },
    {
      title: "Tech Conference",
      date: new Date("2024-06-15"),
      location: "Convention Center",
      description: "A gathering of technology enthusiasts and experts sharing knowledge."
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

// Admin Routes
async function getEvents() {
  await connect(); // Ensure the database is connected
  return await Event.find({}).sort({ date: 1 }); // Sort by 'date' in ascending order
}

async function getVenues() {
  await connect(); // Ensure the database is connected
  return await Venue.find({}).sort({ name: 1 }); // Sort by 'name' in ascending order
}

async function addEvent(title, date, location, description) {
  await connect();
  const event = new Event({ title, date, location, description });
  await event.save();
  return event; // Return the newly created event
}

async function addVenue(name, address, capacity, amenities) {
  await connect();
  const venue = new Venue({ name, address, capacity, amenities });
  await venue.save();
  return venue; // Return the newly created venue
}

// Export the functions
module.exports = {
  initializeData,
  getEvents,   // The function to get events
  getVenues,   // The function to get venues
  addEvent,    // the function to add events
  addVenue     // the function to add venues
};
