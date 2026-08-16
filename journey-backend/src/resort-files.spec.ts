import { resolve } from 'node:path';
import { resolveResortFiles } from './resort-files';

describe('resolveResortFiles', () => {
  it('uses the repository input files when no options are provided', () => {
    expect(resolveResortFiles([])).toEqual({
      mapPath: resolve(__dirname, '../../map.ascii'),
      bookingsPath: resolve(__dirname, '../../bookings.json'),
    });
  });

  it('accepts explicit map and bookings paths', () => {
    expect(
      resolveResortFiles(['--map', 'map.ascii', '--bookings', 'bookings.json']),
    ).toEqual({
      mapPath: resolve(__dirname, '../../map.ascii'),
      bookingsPath: resolve(__dirname, '../../bookings.json'),
    });
  });

  it('rejects an unreadable configured file', () => {
    expect(() => resolveResortFiles(['--map', 'missing-map.ascii'])).toThrow(
      'Configured mapPath must be a readable file',
    );
  });
});
