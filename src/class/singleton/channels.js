import Channel from '@/class/Channel';

export const authChannel = new Channel('auth');
export const signChannel = new Channel('sign');
export const accountChannel = new Channel('account');
export const permissionChannel = new Channel('permission');

export default {
  authChannel,
  signChannel,
  accountChannel,
  permissionChannel,
};
