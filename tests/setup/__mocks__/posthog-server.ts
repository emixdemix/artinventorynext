export const getPostHogClient = () => ({
  capture: jest.fn(),
  shutdown: jest.fn(async () => undefined),
  identify: jest.fn(),
  alias: jest.fn(),
})
