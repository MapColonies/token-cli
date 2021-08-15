import { setTimeout as asyncSetTimeout } from 'timers/promises';
import ora from 'ora';

export const isTesting = process.env.NODE_ENV === 'testing';

export const spinify = async <R, A extends unknown[], F extends (...args: A) => Promise<R>>(
  func: F,
  options: { message: string; timeout?: number },
  ...args: A
): Promise<ReturnType<F>> => {
  let spinner: ora.Ora | undefined = undefined;
  if (!isTesting) {
    spinner = ora(options.message).start();

    if (options.timeout !== undefined) {
      await asyncSetTimeout(options.timeout);
    }
  }

  try {
    const returnValue = await func(...args);
    spinner?.stopAndPersist({ symbol: '✔️' });
    return returnValue;
  } catch (error) {
    spinner?.fail();
    throw error;
  }
};
