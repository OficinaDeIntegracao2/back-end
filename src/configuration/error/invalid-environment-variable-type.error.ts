export default class InvalidEnvironmentVariableTypeError extends Error {
  constructor(environmentVariable: string, value: string) {
    super(
      `${InvalidEnvironmentVariableTypeError.name}: environment variable '${environmentVariable}' is not a number: 
      '${value}'`,
    );
  }
}