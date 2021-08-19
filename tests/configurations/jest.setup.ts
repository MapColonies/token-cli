import fs from 'fs';
import { FILE_STORAGE_DIR } from '../testConstants';

export default (): void => {
  if (!fs.existsSync(FILE_STORAGE_DIR)) {
    fs.mkdirSync(FILE_STORAGE_DIR, { recursive: true });
  }
};
