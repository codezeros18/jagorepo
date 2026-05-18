import "dotenv/config";
import app from "./app";

const PORT = parseInt(process.env.PORT ?? process.env.API_PORT ?? "3001");

app.listen(PORT, () => {
  console.log(`JagaRepo API berjalan di http://localhost:${PORT}`);
});
