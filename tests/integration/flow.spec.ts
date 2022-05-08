import fs from 'fs';
import path from 'path';
import { executeCli } from '../helpers/execute';
import { CLIENT_NAME, FILE_STORAGE_DIR, KID } from '../testConstants';

const flowWorkWorkdir = path.join(FILE_STORAGE_DIR, 'flow');
const flowPublicKeyPath = path.join(flowWorkWorkdir, 'publicKey.jwk');
const flowPrivateKeyPath = path.join(flowWorkWorkdir, 'privateKey.jwk');

describe('flow', function () {
  beforeAll(function () {
    if (!fs.existsSync(flowWorkWorkdir)) {
      fs.mkdirSync(flowWorkWorkdir);
    }
  });

  it('should execute all of the commands', async function () {
    const { exitCode: genKeyExitCode } = await executeCli(['generate-key', '-i', KID, '-p', flowWorkWorkdir]);

    expect(genKeyExitCode).toEqual(0);

    const { exitCode: genTokenExitCode, stdout: token } = await executeCli([
      'generate-token',
      '-f',
      flowPrivateKeyPath,
      '-c',
      CLIENT_NAME,
      '-o',
      'https://localhost:8080',
      '-d',
      'raster',
    ]);

    expect(genTokenExitCode).toEqual(0);

    const { exitCode, stdout } = await executeCli(['verify', '-t', token, '-f', flowPublicKeyPath]);

    expect(exitCode).toEqual(0);
    expect(JSON.parse(stdout)).toMatchObject({ ao: ['https://localhost:8080'], d: ['raster'], sub: 'avi', iss: 'mapcolonies-token-cli' });
  });
});
