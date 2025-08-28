import app from './app';
import { AppConfig } from './config';

const PORT = AppConfig.port || 3000;

app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`);
  console.log(`API http://localhost:${PORT}/api`);
});
