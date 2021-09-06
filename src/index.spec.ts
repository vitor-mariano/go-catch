import goCatch, { Failable } from '.';

interface Expected {
  a: number;
}

describe('goCatch', () => {
  const input = '{"a":1}';
  const invalidInput = '{"a":1{';
  const expected = { a: 1 };

  const asyncParse = async <T>(text: string): Promise<T> => JSON.parse(text);
  const asyncStringify = async (value: any) => JSON.stringify(value);

  test('should resolve synchronous functions', () => {
    const [parsedValue, parseError]: Failable<Expected> = goCatch<Expected>(JSON.parse)(input);
    expect([parsedValue, parseError]).toEqual([expected, null]);

    const [stringifiedValue, stringifyError]: Failable<string> = goCatch(JSON.stringify)(expected);
    expect([stringifiedValue, stringifyError]).toEqual([input, null]);
  });
  test('should resolve asynchronous functions', async () => {
    const [parsedValue, parseError]: Failable<Expected> = await goCatch<Promise<Expected>>(asyncParse)(input);
    expect([parsedValue, parseError]).toEqual([expected, null]);

    const [stringifiedValue, stringifyError]: Failable<string> = await goCatch(asyncStringify)(expected);
    expect([stringifiedValue, stringifyError]).toEqual([input, null]);
  });
  test('should return error on a synchronous functions', () => {
    const [parsedData, error]: Failable<Expected> = goCatch<Expected>(JSON.parse)(invalidInput);
    expect(parsedData).toBeNull();
    expect(error).toBeInstanceOf(SyntaxError);
  });
  test('should return error on a asynchronous functions', async () => {
    const [parsedData, error]: Failable<Expected> = await goCatch<Promise<Expected>>(asyncParse)(invalidInput);
    expect(parsedData).toBeNull();
    expect(error).toBeInstanceOf(SyntaxError);
  });
});
