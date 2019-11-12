import ProgressTimer from '@/class/ProgressTimer';

describe('ProgressTimer', () => {
  const totalMs = 10000;
  let timer;

  beforeEach(() => {
    jest.useFakeTimers();
    timer = new ProgressTimer();
    jest.clearAllMocks();
  });

  it('should change progress for one step', () => {
    timer.startProgress(0, 100, totalMs);

    expect(timer.progressRange).toBe(0);

    jest.runOnlyPendingTimers();

    expect(timer.progressRange).toBe(10);

    timer.fillAndStopProgress();

    expect(timer.progressRange).toBe(100);
  });

  it('should subscribe progress', () => {
    const handler = jest.fn();
    timer.on(handler);
    timer.startProgress();

    expect(handler).toBeCalledWith(0);

    jest.runOnlyPendingTimers();

    expect(handler).toBeCalledWith(5);

    timer.fillAndStopProgress();

    expect(handler).toBeCalledWith(100);
  });

  it('should unsubscribe', () => {
    const handler = jest.fn();
    timer.on(handler);
    timer.startProgress();

    expect(handler).toBeCalledWith(0);

    timer.off(handler);

    jest.runOnlyPendingTimers();

    expect(handler).toBeCalledTimes(1);
  });

  it('should set range', () => {
    timer.startProgress(0, 50, totalMs);

    jest.runOnlyPendingTimers();

    expect(timer.progressRange).toBe(5);

    timer.continueProgress(50, 100);

    expect(timer.progressRange).toBe(50);

    jest.runOnlyPendingTimers();

    expect(timer.progressRange).toBe(55);
  });
});
