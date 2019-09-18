import toBridge from '@/streams/middleware/toBridge';
import router from '@/router';

describe('toBridge', () => {
  it('should redirect to bridge', () => {
    toBridge();
    expect(router.replace).toBeCalledWith('/bridge');
  });
});
