const express = require("express");
const router = express.Router();
const pool = require("../db");
const axios = require("axios");
require("dotenv").config();

const symbolMap = {
  BTC: "bitcoin",
  ETH: "ethereum",
  DOGE: "dogecoin",
  LTC: "litecoin"
};

// Obtener historial
router.get("/history", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM history ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error en /history:", err);
    res.status(500).json({
      error: "Error al obtener historial",
      details: err.code || err.message || "Problema interno en el servidor"
    });
  }
});

// Consultar precio y guardar en DB
router.get("/prices/:symbol", async (req, res) => {
  let { symbol } = req.params;
  symbol = symbol.toUpperCase();

  const apiSymbol = symbolMap[symbol];
  if (!apiSymbol) {
    return res.status(404).json({ error: "Símbolo no soportado" });
  }

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${apiSymbol}&vs_currencies=usd`,
      { timeout: 5000 }
    );

    const price = response.data[apiSymbol]?.usd;
    if (!price) {
      return res.status(502).json({ error: "CoinGecko no devolvió datos válidos" });
    }

    await pool.query(
      "INSERT INTO history(symbol, price, created_at) VALUES (?, ?, NOW())",
      [symbol, price]
    );

    res.json({ symbol, price });
  } catch (err) {
    console.error("Error en /prices:", err);

    if (err.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Timeout al consultar CoinGecko" });
    }
    if (err.response) {
      return res.status(err.response.status).json({
        error: "CoinGecko devolvió error",
        details: err.response.data
      });
    }

    res.status(500).json({
      error: "Error al consultar precio",
      details: err.message || "Problema interno en el servidor"
    });
  }
});

module.exports = router;
