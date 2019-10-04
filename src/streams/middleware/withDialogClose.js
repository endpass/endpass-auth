import dialogClose from '@/streams/actions/dialogClose';
import { METHODS } from '@/constants';

export default function withDialogClose(options, action) {
  if (action.req.method === METHODS.DIALOG_CLOSE) {
    return;
  }
  dialogClose();
}
