import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

@Injectable()
export class LogsService {
  private readonly logFilePath: string;

  constructor(private readonly config: ConfigService) {
    this.logFilePath = path.resolve(
      config.get<string>('LOG_FILE_PATH', 'logs/app.log'),
    );
  }

  async getLastLines(limit = 200): Promise<object[]> {
    if (!fs.existsSync(this.logFilePath)) return [];

    const lines: object[] = [];

    await new Promise<void>((resolve, reject) => {
      const rl = readline.createInterface({
        input: fs.createReadStream(this.logFilePath),
        crlfDelay: Infinity,
      });
      rl.on('line', (line) => {
        if (!line.trim()) return;
        try {
          lines.push(JSON.parse(line));
        } catch {
          lines.push({ raw: line });
        }
      });
      rl.on('close', resolve);
      rl.on('error', reject);
    });

    return lines.slice(-limit).reverse();
  }

  clearLogs(): void {
    if (!fs.existsSync(this.logFilePath)) {
      throw new NotFoundException('Arquivo de log não encontrado');
    }
    fs.writeFileSync(this.logFilePath, '');
  }
}
