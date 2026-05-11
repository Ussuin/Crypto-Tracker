import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Container } from "@mui/material";
import api from "../api"; // tu api.js con getPrice y getHistory

const Inicio = ({ onSearch, coinData }) => {
  const [symbol, setSymbol] = useState("");

  // 🔎 handleSearch corregido
  const handleSearch = async () => {
    try {
      const cleanSymbol = symbol.trim().toUpperCase();
      const data = await api.getPrice(cleanSymbol); // precio real desde backend
      const updatedHistory = await api.getHistory(); // historial desde DB

      onSearch(data, updatedHistory); // pasa datos al padre
    } catch (err) {
      console.error("Error en handleSearch:", err.message);
      alert(err.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Criptomoneda</Typography>
        <TextField
          label="Símbolo"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Consultar
        </Button>

        {coinData && (
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <Typography><b>Nombre:</b> {coinData.symbol}</Typography>
            <Typography><b>Precio actual:</b> ${parseFloat(coinData.price).toFixed(2)} USD</Typography>
            <Typography><b>Fecha:</b> {coinData.created_at}</Typography>
            <Typography><b>Máximo 7d:</b> ${coinData.high7d}</Typography>
            <Typography><b>Mínimo 7d:</b> ${coinData.low7d}</Typography>
            <Typography><b>Volumen 24h:</b> {coinData.volume}</Typography>
            <Typography><b>Market Cap:</b> {coinData.marketCap}</Typography>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default Inicio;
