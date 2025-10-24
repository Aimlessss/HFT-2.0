import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
class Logger {
  private logFilePath: string;

  constructor(logFileName = 'realTimeTrade.log') {
    const logDir = path.resolve(__dirname, 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    this.logFilePath = path.join(logDir, logFileName);
  }

  log(message: string) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, formattedMessage, { encoding: 'utf8' });
    console.log(formattedMessage.trim());
  }
}
const logger = new Logger();
export default logger;  