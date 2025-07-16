import { parentPort, workerData, threadId } from 'worker_threads';
import sharp from 'sharp';
import * as fs from 'fs/promises';
import { join } from 'path';

async function makeThumb() {
  try {
    const { inputPath, outputDir } = workerData as { inputPath: string; outputDir: string };
    console.log(`[worker ${threadId}] processing ${inputPath}`);
    const filename = inputPath.split(/[\\/]/).pop()!;
    const dest = join(outputDir, filename);

    await fs.mkdir(outputDir, { recursive: true });
    await sharp(inputPath)
      .resize(150, 150, { fit: 'inside' })
      .toFile(dest);

    parentPort!.postMessage({ status: 'processed' });
  } catch {
    parentPort!.postMessage({ status: 'skipped' });
  }
}

makeThumb();
