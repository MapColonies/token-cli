import { writeFile } from 'fs/promises';
import { EOL } from 'os';
import path from 'path';
import { executeCli } from '../../helpers/execute';
import { PRIVATE_KEY, PUBLIC_KEY } from '../../keys';
import { CLIENT_NAME, FILE_STORAGE_DIR } from '../../testConstants';

const publicKeyPath = path.join(FILE_STORAGE_DIR, 'verifyPublicKeyAvi.jwk');
const badPublicKeyPath = path.join(FILE_STORAGE_DIR, 'verifyPublicKeyNot.jwk');

describe('verify', function () {
  let token: string;
  beforeAll(async function () {
    const privateTokenPath = path.join(FILE_STORAGE_DIR, 'verifyPrivateKeyAvi.jwk');
    await writeFile(privateTokenPath, JSON.stringify(PRIVATE_KEY), { encoding: 'utf-8' });
    await writeFile(publicKeyPath, JSON.stringify(PUBLIC_KEY), { encoding: 'utf-8' });
    await writeFile(badPublicKeyPath, JSON.stringify({ ...PUBLIC_KEY, kid: 'not' }), { encoding: 'utf-8' });
    const { exitCode, stdout } = await executeCli(['generate-token', '-f', privateTokenPath, '-c', CLIENT_NAME, '-o', 'https://localhost:8080']);
    if (exitCode === null || exitCode > 0) {
      throw new Error('failed creating token');
    }
    token = stdout;
  });

  describe('Happy Path', function () {
    it('should return exit code 0 and the payload of the token was signed by the given key', async function () {
      const { exitCode, stdout } = await executeCli(['verify', '-t', token, '-f', publicKeyPath]);

      expect(exitCode).toEqual(0);
      expect(JSON.parse(stdout)).toMatchObject({ ao: ['https://localhost:8080'], sub: 'avi', iss: 'mapcolonies-token-cli' });
    });
  });
  describe('Bad Path', function () {
    it("should return error exit code if the token wasnt't signed by the given private key", async function () {
      const { exitCode, stderr } = await executeCli([
        'verify',
        '-t',
        'eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2MjkyODQ0NjgsInN1YiI6ImF2aSIsImlzcyI6Im1hcGNvbG9uaWVzLXRva2VuLWNsaSJ9.Z81lruHo3j3rCPnpFzKw5w9uW4UHuVY2KOQQFFja_FMrRqk5sP7uYIB09yi-7TtwZ3jLd7SXWPQugl0Lk1Wx_3m9XmeWNqJfT3Qp6qBZi6eC6wwcu1ylVKOB7Y9lbYi3bLcSj4xcgfCQzwWmk_Ue1iw9iemoytvTL674pnlMni3eWMWcQ4tc2CDyHTSQHG-jdlWBuEzMFIgmSQGZw6oMXuSQ-lWvCHmWMAbSnNr0RprxHxYJwjDkXi_M33m-uXTjb96Uonjtp6WRFM9pPtvljk5ntLoZ8WkHi-QTrOXyHjJl7WFl0GQJzz9sY8n-4k1KiJLxLu0bwNJPAxI1cT0L6g',
        '-f',
        publicKeyPath,
      ]);

      expect(exitCode).not.toEqual(0);
      expect(stderr).toMatch('signature verification failed');
    });

    it("should return error exit code if the kid doesn't match", async function () {
      const { exitCode, stderr } = await executeCli(['verify', '-t', token, '-f', badPublicKeyPath]);

      expect(exitCode).not.toEqual(0);
      expect(stderr).toMatch("kid doesn't match");
    });

    it('should exit with error code if token option is missing', async function () {
      const { exitCode, stderr } = await executeCli(['verify', '-f', '/dskdms.jwk']);
      expect(exitCode).not.toEqual(0);
      const stdErrLines = stderr.split(EOL);
      expect(stdErrLines[stdErrLines.length - 2]).toEqual('Missing required argument: token');
    });

    it('should exit with error code if file option is missing', async function () {
      const { exitCode, stderr } = await executeCli(['verify', '-t', token]);
      expect(exitCode).not.toEqual(0);
      const stdErrLines = stderr.split(EOL);
      expect(stdErrLines[stdErrLines.length - 2]).toEqual('Missing required argument: f');
    });

    it('should exit with error code if private key file doesn\t exist', async function () {
      const { exitCode, stderr } = await executeCli(['verify', '-t', token, '-f', '/dskdms.jwk']);
      expect(exitCode).not.toEqual(0);

      expect(stderr).toMatch('no such file or directory');
    });

    it('should exit if private key is not valid', async function () {
      const badKeyPath = path.join(FILE_STORAGE_DIR, 'badKey.jwk');
      await writeFile(badKeyPath, JSON.stringify({ avi: 'avi' }), { encoding: 'utf-8' });

      const { exitCode, stderr } = await executeCli(['verify', '-t', token, '-f', badKeyPath]);
      expect(exitCode).not.toEqual(0);

      expect(stderr).toMatch("Couldn't parse the content of the file into a valid jwk object");
    });
  });
});
