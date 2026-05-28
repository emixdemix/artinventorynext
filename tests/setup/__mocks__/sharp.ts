const sharp: any = jest.fn(() => ({
  metadata: jest.fn(async () => ({ width: 100, height: 100, format: 'png' })),
  resize: jest.fn().mockReturnThis(),
  toBuffer: jest.fn(async () => Buffer.from('')),
  jpeg: jest.fn().mockReturnThis(),
  png: jest.fn().mockReturnThis(),
}))
export default sharp
