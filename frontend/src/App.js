import React, { useState } from "react";
import { CssBaseline, Container, Typography, Grid } from "@mui/material";
import Inicio from "./components/Inicio";
import HistoryTable from "./components/HistoryTable";
import PriceChart from "./components/PriceChart";

function App() {
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [coinData, setCoinData] = useState(null);

  const handleNewSearch = (data, chart) => {
    setCoinData(data);
    setChartData(chart);
    setHistory((prev) => [...prev, data]);
  };

  return (
    <div>
      <CssBaseline />
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h3" sx={{ color: "#00ff88", mb: 1 }}>
          CryptoTracker
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          Consulta toda la información de tus criptomonedas
        </Typography>

        {/* Buscador + ficha */}
        <Inicio onSearch={handleNewSearch} coinData={coinData} />

        {/* Gráfica */}
        <Grid item xs={12} sx={{ mt: 5 }}>
          <PriceChart data={chartData} />
        </Grid>

        {/* Historial */}
        <Grid item xs={12} sx={{ mt: 5 }}>
          <HistoryTable data={history} />
        </Grid>
      </Container>
    </div>
  );
}

export default App;
