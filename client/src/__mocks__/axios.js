export default {
  get: jest.fn().mockImplementation(),
  post: jest.fn().mockImplementation(),
  defaults: { headers: { common: { Authorization: '' } } },
}
