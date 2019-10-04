import dialogOpen from '@/streams/actions/dialogOpen';

export default function toLoader(options) {
  if (options.routeName !== undefined) {
    dialogOpen('loader');
  }
}
