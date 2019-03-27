import dialogOpen from '../dialogOpen';

export default function toLoader(options) {
  if (options.routeName !== undefined) {
    dialogOpen('loader');
  }
}
