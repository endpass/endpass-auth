import withDialogClose from '@/streams/middleware/withDialogClose';
import bridgeMessenger from '@/class/singleton/bridgeMessenger';
import { METHODS } from '@/constants';

describe('withDialogClose', () => {
  const options = {
    routeName: 'dialogPath',
  };
  const action = {
    req: {
      method: 'method',
    },
  };

  beforeEach(() => {
    bridgeMessenger.send = jest.fn();
  });

  it('should call withDialogClose', () => {
    withDialogClose(options, action);

    expect(bridgeMessenger.send).toBeCalledWith(METHODS.DIALOG_CLOSE);
  });

  it('should not call withDialogClose', () => {
    withDialogClose(options, {
      req: {
        method: METHODS.DIALOG_CLOSE,
      },
    });

    expect(bridgeMessenger.send).not.toBeCalled();
  });
});
