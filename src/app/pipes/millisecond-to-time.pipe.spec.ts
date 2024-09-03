import { MillisecondToTimePipe } from './millisecond-to-time.pipe';

describe('MillisecondToTimePipe', () => {
  it('create an instance', () => {
    const pipe = new MillisecondToTimePipe();
    expect(pipe).toBeTruthy();
  });
});
