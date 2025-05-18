// Backend server
const app = require("./app");

// Environment variables
const PORT = process.env.PORT || 8000;

// Server başlat
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});