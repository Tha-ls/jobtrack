
import express from 'express';

const app = express();
const PORT = 3000;

// Permite receber dados enviados em JSON.
app.use(express.json());

// Disponibiliza os arquivos da interface web.
app.use(express.static('public'));

// Rota inicial para testar o servidor.
app.get('/api/status', (req, res) => {
  res.json({
    mensagem: 'JobTrack está funcionando!',
    status: 'online',
  });
});

app.listen(PORT, () => {
  console.log(`JobTrack disponível em http://localhost:${PORT}`);
});
