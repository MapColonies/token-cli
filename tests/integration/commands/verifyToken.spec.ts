import { writeFile } from 'fs/promises';
import { EOL } from 'os';
import { executeCli } from '../../helpers/execute';

const privateKey = {
  kty: 'RSA',
  n: 'yjpwlTamiqnawBpT_cE3cDaP-y5PH7CWpIMsqm3M5DS4WY4vf0JtR2YFRrRrWFq8fc4lZ4JdxGHyRUJcmp8tPuMGWEOJ-_LLOY50ng0iNWTzwj8JiZooDnCt1vDhCBh1qk2aUTfTTawXGQOQ32aKTWU8tOh2TDQgAzGksIIvV-1Igv1dmsJqN1vv3Ym1ExTq0x0zfoNPgxsxIrCfLMhxL5tw-nN5JSRv8Fy4vdc3cYwpMi8Igoh_5wJX5KEAgp-0LvEZTX_PROfMlSFOD_wnPPqiq3LjV8U6wgf3DjcsN-XOf6-VQDz2OD9O1_qkm6oTWSD94aPgcDJzqjPAG5JoLw',
  e: 'AQAB',
  d: 'pM07Ml53GkmRmzvZdtIe-7N7Ypc6o_ikyyybGcihUNgl49Wbn3ni1GyvoA8n67kGIv_8O35iK8gmR4rtLJTLqpQYd5WSvV__fcg6ARNy7VB31bTJcPnP6vSotqFWweItAbx8JfP4nzO_HwNo7KYDz07RShynSzKvY-rw62csbdndJgdcf7eEWV5aIP_S2f6v86cZO7Lr9OQeOg1XUKN1kkKSl7DGy8l3Rr3bCCY9KTsrzI5hDVc1FgIP1WPJ7o6MpZ6A65KdlgyLMZ-g9OF8HLCwxmzRtJqOcVlGkgRLK8mPfHXNMmk-dAxsJ2awA7K4FrfjHwsQcLBL54moem8jAQ',
  p: '9_CcB3B-26gyIRIxsnulTGQ4uWv7jrS0tEUJHRUL47hoAhlmzG4KQ1aK9K-qsgW7G2ovAeeCfxIgM1KKGcKXFjYzwt3fToZm-SzmcNbs6iTUCwF7ZcJvbBUPAI5hmP6uVg-XfgBapf0lfbEoS_3eyE1iLrCKl6UP_THQcCHtlos',
  q: '0M1pdDHWU7tTSCAKm9phnPb89OuqYauBPRD7oijw08PuYvFKzY5gkDk9IISUzDYD4H7c_R2-qt9bIsVhJKE9QE9ZTJIyyd4NUhy2Z1MfkcWRb_rP9HM5keDHnI-7-SXKb6qCL-e7u50P2JKPqirlPEaRlxike-QiBNnWbY8UzW0',
  dp: 'R9Pyv8z9U1FUxHPq5dQgPRNDw6PeyqbbOuZND5nLSftgVktZlpvCaWOm-d_ySYSTgguu9pRFH972aSfeTjwrXQny0N9KFAunxUQWtlXtaJ-mtlGFmCNN-DfZksWszI_rnY8CykP7_t5pgBJUpD81zT1t1iza2be9_BH0WqfZlqU',
  dq: 'VT7Hgsyl9-FOiu-p5R8vIuojM8rS8LUYOloooXedepdPR83DAFDUU41Ky2_VX9ndk1W32w69vP0bNALpOg8p9otupbg6S_f_8DoQrfZduSGz0sfPBrnUEx514BE-aOVo1FYEeJJfLqVcxspvJMYGeKlG3y0MWhg1W02kIW58y7E',
  qi: 'REh8BI-gbD_BdD2789xEoibKXjTTlSbPuf2PX9dBKsBgL7z4qlWegmLXx9uuaPHKagrbfcHvNkM2wx4telIc5nmWdvZITetxfxB2ICtbhwsOk0LIXHo26f_AvdTleicRGL0lbYc7wv71bBF4q34ro_KOOdKfophSjzElskeMiUQ',
  alg: 'RSA256',
  kid: 'avi',
};

const publicKey = {
  kty: 'RSA',
  n: 'yjpwlTamiqnawBpT_cE3cDaP-y5PH7CWpIMsqm3M5DS4WY4vf0JtR2YFRrRrWFq8fc4lZ4JdxGHyRUJcmp8tPuMGWEOJ-_LLOY50ng0iNWTzwj8JiZooDnCt1vDhCBh1qk2aUTfTTawXGQOQ32aKTWU8tOh2TDQgAzGksIIvV-1Igv1dmsJqN1vv3Ym1ExTq0x0zfoNPgxsxIrCfLMhxL5tw-nN5JSRv8Fy4vdc3cYwpMi8Igoh_5wJX5KEAgp-0LvEZTX_PROfMlSFOD_wnPPqiq3LjV8U6wgf3DjcsN-XOf6-VQDz2OD9O1_qkm6oTWSD94aPgcDJzqjPAG5JoLw',
  e: 'AQAB',
  alg: 'RSA256',
  kid: 'avi',
};
describe('verify', function () {
  let token: string;
  beforeAll(async function () {
    await writeFile('/tmp/avi/verifyPrivateKeyAvi.jwk', JSON.stringify(privateKey), { encoding: 'utf-8' });
    await writeFile('/tmp/avi/verifyPublicKeyAvi.jwk', JSON.stringify(publicKey), { encoding: 'utf-8' });
    await writeFile('/tmp/avi/verifyPublicKeyNot.jwk', JSON.stringify({ ...publicKey, kid: 'not' }), { encoding: 'utf-8' });
    const { exitCode, stdout } = await executeCli([
      'generate-token',
      '-f',
      '/tmp/avi/generateTokenPrivateKey.jwk',
      '-c',
      'avi',
      '-o',
      'https://localhost:8080',
    ]);
    if (exitCode === null || exitCode > 0) {
      throw new Error('failed creating token');
    }
    token = stdout;
  });

  describe('Happy Path', function () {
    it('should return exit code 0 and the payload of the token was signed by the given key', async function () {
      const { exitCode, stdout } = await executeCli(['verify', '-t', token, '-f', '/tmp/avi/verifyPublicKeyAvi.jwk']);

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
        '/tmp/avi/verifyPublicKeyAvi.jwk',
      ]);

      expect(exitCode).not.toEqual(0);
      expect(stderr).toMatch('signature verification failed');
    });

    it("should return error exit code if the kid doesn't match", async function () {
      const { exitCode, stderr } = await executeCli(['verify', '-t', token, '-f', '/tmp/avi/verifyPublicKeyNot.jwk']);

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
      await writeFile('/tmp/avi/badKey.jwk', JSON.stringify({ avi: 'avi' }), { encoding: 'utf-8' });

      const { exitCode, stderr } = await executeCli(['verify', '-t', token, '-f', '/tmp/avi/badKey.jwk']);
      expect(exitCode).not.toEqual(0);

      expect(stderr).toMatch("Couldn't parse the content of the file into a valid jwk object");
    });
  });
});
