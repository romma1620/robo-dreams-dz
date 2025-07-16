import { Injectable, OnModuleDestroy, BadRequestException } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { Mutex } from 'async-mutex';
import { v4 as uuidv4 } from 'uuid';
import * as os from 'os';
import * as fs from 'fs/promises';
import * as unzipper from 'unzipper';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SharedState {
  processed: number;
  skipped: number;
}

@Injectable()
export class ZipService implements OnModuleDestroy {
  private workers: Worker[] = [];

  public async handleZip(file: any) {
    if (!file.buffer) {
      throw new BadRequestException('Empty buffer');
    }

    const requestId = uuidv4();
    const baseTmp = join(os.tmpdir(), requestId);
    await fs.mkdir(baseTmp, { recursive: true });

    const bufferStream = Readable.from(file.buffer);
    await bufferStream.pipe(unzipper.Extract({ path: baseTmp })).promise();

    const directory = await unzipper.Open.buffer(file.buffer);
    const entries = directory.files.filter(e => e.type === 'File');
    const totalFiles = entries.length;

    await Promise.all(entries.map(async entry => {
      const destPath = join(baseTmp, entry.path);
      await fs.mkdir(dirname(destPath), { recursive: true });
      const content = await entry.buffer();
      await fs.writeFile(destPath, content);
    }));

    const files: string[] = [];
    async function collect(dir: string) {
      for (const d of await fs.readdir(dir, { withFileTypes: true })) {
        const p = join(dir, d.name);
        if (d.isDirectory()) {
          await collect(p);
        } else {
          files.push(p);
        }
      }
    }
    await collect(baseTmp);
    const state: SharedState = { processed: 0, skipped: 0 };
    const mutex = new Mutex();
    const t0 = performance.now();

    await Promise.all(files.map(fp =>
     new Promise<void>(resolve => {
       const worker = new Worker(
        join(__dirname, '../workers/thumbnail.worker.js'),
        { workerData: { inputPath: fp, outputDir: join(baseTmp, 'thumbs') } }
       );
       this.workers.push(worker);

       const done = async (status: 'processed' | 'skipped') => {
         await mutex.runExclusive(() => { state[status]++; });
         await worker.terminate();
         resolve();
       };

       worker.on('message', (msg: { status: 'processed' | 'skipped' }) => done(msg.status));
       worker.on('error', () => done('skipped'));
     })
    ));

    const durationMs = Math.round(performance.now() - t0);

    await new Promise(r => setTimeout(r, 100));
    try {
      await fs.rm(baseTmp, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    } catch (err: any) {
      if (err.code !== 'EPERM') throw err;
    }

    if (state.processed + state.skipped !== totalFiles) {
      throw new Error(`Mismatch: processed+skipped=${state.processed + state.skipped} but total=${totalFiles}`);
    }

    return { processed: state.processed, skipped: state.skipped, durationMs };
  }

  onModuleDestroy() {
    for (const w of this.workers) {
      w.terminate();
    }
  }
}
