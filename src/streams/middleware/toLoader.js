import dialogOpen from '@/streams/Actions/dialogOpen';

export default function toLoader(options) {
  if (options.routeName !== undefined) {
    dialogOpen('loader');
  }
}
