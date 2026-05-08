const express = require("express");
const cors = require("cors");
require("dotenv").config();



const app = express();
app.use(cors());
app.use(express.json());


const pool = require("./db");
(async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ Conexión exitosa:", rows);
  } catch (err) {
    console.error("❌ Error de conexión:", err);
  }
})();

// Rutas
const cryptoRoutes = require("./routes/crypto");
app.use("/api", cryptoRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});