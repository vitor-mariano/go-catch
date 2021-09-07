import { Failable, goCatchWrap, goCatch } from '.';

interface Expected {
  a: number;
}

const input = '{"a":1}';
const invalidInput = '{"a":1{';
const expected = { a: 1 };

const asyncParse = async <T>(text: string): Promise<T> => JSON.parse(text);
const asyncStringify = async (value: any) => JSON.stringify(value);

describe('goCatch', () => {
  test('should resolve asynchronous functions', async () => {
    const [parsedValue, parseError] = await goCatch(asyncParse<Expected>(input));
    expect([parsedValue, parseError]).toEqual([expected, null]);

    const [stringifiedValue, stringifyError] = await goCatch(asyncStringify(expected));
    expect([stringifiedValue, stringifyError]).toEqual([input, null]);
  });
  test('should return error on asynchronous functions', async () => {
    const [parsedData, error] = await goCatch(asyncParse(invalidInput));
    expect(parsedData).toBeNull();
    expect(error).toBeInstanceOf(SyntaxError);
  });
});

describe('goCatchWrap', () => {
  test('should resolve synchronous functions', () => {
    const [parsedValue, parseError]: Failable<Expected> = goCatchWrap<Expected>(JSON.parse)(input);
    expect([parsedValue, parseError]).toEqual([expected, null]);

    const [stringifiedValue, stringifyError]: Failable<string> = goCatchWrap(JSON.stringify)(expected);
    expect([stringifiedValue, stringifyError]).toEqual([input, null]);
  });
  test('should resolve asynchronous functions', async () => {
    const [parsedValue, parseError]: Failable<Expected> = await goCatchWrap<Promise<Expected>>(asyncParse)(input);
    expect([parsedValue, parseError]).toEqual([expected, null]);

    const [stringifiedValue, stringifyError]: Failable<string> = await goCatchWrap(asyncStringify)(expected);
    expect([stringifiedValue, stringifyError]).toEqual([input, null]);
  });
  test('should return error on synchronous functions', () => {
    const [parsedData, error]: Failable<Expected> = goCatchWrap<Expected>(JSON.parse)(invalidInput);
    expect(parsedData).toBeNull();
    expect(error).toBeInstanceOf(SyntaxError);
  });
  test('should return error on asynchronous functions', async () => {
    const [parsedData, error]: Failable<Expected> = await goCatchWrap<Promise<Expected>>(asyncParse)(invalidInput);
    expect(parsedData).toBeNull();
    expect(error).toBeInstanceOf(SyntaxError);
  });
});
