const mongoose = require("mongoose");

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/appointment-saas";

// MongoDB bağlantı seçenekleri
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// MongoDB bağlantısı
mongoose.connect(MONGODB_URI, options)
  .then(() => {
    console.log("MongoDB veritabanına başarıyla bağlandı");
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
    process.exit(1);
  });

// MongoDB event handlers
mongoose.connection.on("error", (err) => {
  console.error("MongoDB bağlantı hatası:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB bağlantısı kesildi");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB bağlantısı kapatıldı ve uygulama sonlandırıldı");
  process.exit(0);
});

module.exports = mongoose.connection;