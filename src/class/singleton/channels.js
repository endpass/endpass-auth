import Channel from '@/class/Channel';

export const authChannel = new Channel('auth');
export const signChannel = new Channel('sign');
export const accountChannel = new Channel('account');
export const permissionChannel = new Channel('permission');
export const documentChannel = new Channel('document');
export const walletChannel = new Channel('wallet');

export default {
  authChannel,
  signChannel,
  accountChannel,
  permissionChannel,
  documentChannel,
  walletChannel,
};
