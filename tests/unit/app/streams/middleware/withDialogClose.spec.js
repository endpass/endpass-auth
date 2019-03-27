import withDialogClose from '@/streams/middleware/withDialogClose';
import bridgeMessenger from '@/class/singleton/messengers';
import { METHODS } from '@/constants';

jest.mock('@/class/singleton/messengers', () => {
  return {
    send: jest.fn(),
  };
});

describe('withDialogClose', () => {
  it('should call withDialogClose', () => {
    const options = {
      routeName: 'dialogPath',
    };

    withDialogClose(options);

    expect(bridgeMessenger.send).toBeCalledWith(METHODS.DIALOG_CLOSE);
  });
});
