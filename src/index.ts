export type Failable<T> = [T | null, Error | null];
type PromisableFailable<T> = T extends PromiseLike<infer U> ? Promise<Failable<U>> : Failable<T>;
type Await<T> = T extends PromiseLike<infer U> ? U : T;

const goCatch =
  <R, P extends any[] = any[]>(callback: (...args: P) => R): ((...args: P) => PromisableFailable<R>) =>
  (...args: P): PromisableFailable<R> => {
    try {
      const value = callback(...args);

      if (value instanceof Promise) {
        return new Promise((resolve: (result: Failable<Await<R>>) => void) => {
          value.then((result: Await<R>) => resolve([result, null])).catch((error) => resolve([null, error]));
        }) as PromisableFailable<R>;
      }

      return [value, null] as PromisableFailable<R>;
    } catch (error) {
      return [null, error as Error] as PromisableFailable<R>;
    }
  };

export default goCatch;
