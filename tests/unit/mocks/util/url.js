jest.mock('@/util/url', () => ({
  queryParamsToObject: jest.fn().mockReturnValue({}),
}));
