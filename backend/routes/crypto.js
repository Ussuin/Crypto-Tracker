const express = require("express");
const router = express.Router();
const pool = require("../db");
const axios = require("axios");
const coinList = require("../coinList");

// Historial completo desde DB
router.get("/history", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM history ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

// Precio actual + histórico 7d
router.get("/prices/:symbol", async (req, res) => {
  let { symbol } = req.params;
  symbol = symbol.trim().toUpperCase();

  if (!coinList.includes(symbol)) {
    return res.status(400).json({ error: `Moneda no soportada: ${symbol}` });
  }

  try {
    // Datos 24h (precio actual, volumen, etc.)
    const ticker = await axios.get(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`
    );

    const price = parseFloat(ticker.data.lastPrice);

    // Histórico últimos 7 días (velas diarias)
    const klines = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&limit=7`
    );

    const history = klines.data.map(candle => ({
      date: new Date(candle[0]).toISOString().split("T")[0],
      price: parseFloat(candle[4]) // precio de cierre
    }));

    // Verificar si ya existe la moneda en la tabla
    const [existing] = await pool.query(
      "SELECT id FROM history WHERE symbol = ? LIMIT 1",
      [symbol]
    );

    if (existing.length > 0) {
      // Si ya existe, actualiza sus datos
      await pool.query(
        "UPDATE history SET price=?, created_at=NOW(), high7d=?, low7d=?, volume=?, marketCap=? WHERE symbol=?",
        [
          price,
          ticker.data.highPrice,
          ticker.data.lowPrice,
          ticker.data.volume,
          ticker.data.quoteVolume,
          symbol
        ]
      );
    } else {
      // Si no existe, inserta nueva fila
      await pool.query(
        "INSERT INTO history(symbol, price, created_at, high7d, low7d, volume, marketCap) VALUES (?, ?, NOW(), ?, ?, ?, ?)",
        [
          symbol,
          price,
          ticker.data.highPrice,
          ticker.data.lowPrice,
          ticker.data.volume,
          ticker.data.quoteVolume
        ]
      );

      // Limitar a 10 registros → borrar los más antiguos si hay más de 10
      await pool.query(
        "DELETE FROM history WHERE id NOT IN (SELECT id FROM (SELECT id FROM history ORDER BY created_at DESC LIMIT 10) as t)"
      );

      // Reiniciar contador AUTO_INCREMENT
      await pool.query("ALTER TABLE history AUTO_INCREMENT = 1");
    }

    // Responder con todos los campos
    res.json({
      symbol,
      price,
      created_at: new Date().toISOString(),
      high7d: ticker.data.highPrice,
      low7d: ticker.data.lowPrice,
      volume: ticker.data.volume,
      marketCap: ticker.data.quoteVolume,
      history
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener precio" });
  }
});

module.exports = router;
