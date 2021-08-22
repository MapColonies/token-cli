import { sync } from 'rimraf';
import { FILE_STORAGE_DIR } from '../testConstants';

export default (): void => {
  sync(FILE_STORAGE_DIR);
};
