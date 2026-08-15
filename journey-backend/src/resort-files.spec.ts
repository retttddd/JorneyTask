import { resolve } from 'node:path';
import { resolveResortFiles } from './resort-files';

describe('resolveResortFiles', () => {
  it('uses the repository input files when no options are provided', () => {
    expect(resolveResortFiles([])).toEqual({
      mapPath: resolve(__dirname, '../../map.ascii'),
      bookingsPath: resolve(__dirname, '../../bookings.json'),
    });
  });
});
