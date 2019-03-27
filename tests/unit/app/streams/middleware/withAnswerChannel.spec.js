import withChannel from '@/streams/middleware/withChannel';
import Channel from '@/class/Channel';

describe('withChannel', () => {
  it('should call action.setResult', done => {
    const channel = new Channel();
    const options = {
      channel,
    };
    const action = {
      setResult(data) {
        expect(data).toBe('data');
        done();
      },
    };
    withChannel(options, action);

    channel.put('data');
  });
});
