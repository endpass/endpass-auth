import ProgressTimer from '@/class/ProgressTimer';

describe('ProgressTimer', () => {
  const totalMs = 10000;
  let timer;

  beforeEach(() => {
    timer = new ProgressTimer();
    jest.clearAllMocks();
  });

  it('should change progress for one step', async () => {
    expect.assertions(3);

    timer.startProgress(totalMs);

    expect(timer.progress).toBe(0);

    await global.flushPromises();

    expect(timer.progress).toBe(10);

    timer.fillAndStopProgress();

    expect(timer.progress).toBe(100);
  });

  it('should subscribe progress', async () => {
    expect.assertions(3);

    const handler = jest.fn();
    timer.on(handler);
    timer.startProgress();

    expect(handler).toBeCalledWith(0);

    await global.flushPromises();

    expect(handler).toBeCalledWith(5);

    timer.fillAndStopProgress();

    expect(handler).toBeCalledWith(100);
  });

  it('should unsubscribe', async () => {
    expect.assertions(2);

    const handler = jest.fn();
    timer.on(handler);
    timer.startProgress();

    expect(handler).toBeCalledWith(0);

    timer.off(handler);

    await global.flushPromises();

    expect(handler).toBeCalledTimes(1);
  });

  it('should set range', async () => {
    expect.assertions(1);

    timer.startProgress(totalMs);
    timer.setRange(0, 50);

    await global.flushPromises();

    expect(timer.progress).toBe(5);
  });
});
