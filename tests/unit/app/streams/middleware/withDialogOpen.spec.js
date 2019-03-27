import withDialogOpen from '@/streams/middleware/withDialogOpen';
import router from '@/router';

describe('withDialogOpen', () => {
  it('should redirect to routeName', () => {
    const options = {
      routeName: 'dialogPath',
    };

    withDialogOpen(options);

    expect(router.replace).toBeCalledWith('/dialogPath');
  });
});
