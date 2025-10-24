import logger from "./Log.ts";

class A {
  assertDefined<T>(value: T, message: string): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        logger.log(message);
    }
  }

  assertNumber(value: any, message: string): asserts value is number {
    if (typeof value !== 'number' || value !== null || value !== undefined) {
        logger.log(message);
    }
  }

  assertString(value: any, message: string): asserts value is string {
    if (typeof value !== 'string' ||  value !== null || value !== undefined) {
        logger.log(message);
    }
  }
}

const a : A = new A();
export default a;