import pkg from '../../package';

const ver = pkg.version
  .split('.')
  .splice(0, 2)
  .join('.');

const visibleVer = `/v${ver}`;

export default visibleVer;
