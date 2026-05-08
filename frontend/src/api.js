import axios from "axios";

const BINANCE_URL = "https://api.binance.com/api/v3";

const coinList = [
  "BTC","ETH","BNB","SOL","ADA","XRP","DOGE","DOT","AVAX","MATIC",
  "SHIB","TRX","LTC","LINK","XLM","BCH","FIL","APT","NEAR","ICP",
  "ARB","OP","SUI","VET","EGLD","HBAR","AAVE","MKR","RUNE","LDO",
  "INJ","DYDX","GMX","CRV","UNI","COMP","SNX","CAKE","GRT","ENJ",
  "MANA","SAND","CHZ","FLOW","STX","KAVA","NEO","ZIL","XTZ","EOS",
  "COTI","CELO","MINA","FTM","NEXO","HOT","BAT","REN","ZRX","1INCH",
  "QTUM","ANKR","OCEAN","BAND","BAL","YFI","UMA","ALPHA","BEL","CVC",
  "DENT","DGB","KNC","LRC","NKN","OMG","PUNDIX","SKL","STORJ","TFUEL",
  "THETA","WAVES","XEM","XMR","ZEN","SRM","SXP","HNT","CELR","CTSI",
  "DODO","FLM","GALA","HIVE","IOST","KSM","LINA","MITH","MTL","NANO",
  "OGN","RSR","TWT","VTHO","WIN","WRX","XVS","ZEC","BUSD","USDC","USDT"
];

const api = {
  // Normaliza el símbolo antes de consultar
  getPrices: async (symbol) => {
    const cleanSymbol = symbol.trim().toUpperCase();

    if (!coinList.includes(cleanSymbol)) {
      throw new Error(`Moneda no soportada: ${cleanSymbol}`);
    }

    // Endpoint más completo: devuelve precio, high, low, volumen, etc.
    const res = await axios.get(`${BINANCE_URL}/ticker/24hr?symbol=${cleanSymbol}USDT`);

    return {
      id: Date.now(),
      symbol: cleanSymbol,
      price: res.data.lastPrice,
      high7d: res.data.highPrice,
      low7d: res.data.lowPrice,
      volume: res.data.volume,
      marketCap: res.data.quoteVolume, // aproximado
      created_at: new Date().toISOString(),
    };
  },

  getAllSymbols: () => coinList,

  // Simulación de histórico de 7 días para la gráfica
  getHistory: async (symbol) => {
    const now = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - i));
      return {
        date: date.toISOString().split("T")[0],
        price: (Math.random() * (80000 - 60000) + 60000).toFixed(2),
      };
    });
  }
};

export default api;
