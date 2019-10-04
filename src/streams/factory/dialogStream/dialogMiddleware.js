import toBridge from '@/streams/middleware/toBridge';
import toLoader from '@/streams/middleware/toLoader';
import withAuth from '@/streams/middleware/withAuth';
import withPermission from '@/streams/middleware/withPermission';
import withPayloadHandler from '@/streams/middleware/withPayloadHandler';
import withCommit from '@/streams/middleware/withCommit';
import withDialogOpen from '@/streams/middleware/withDialogOpen';
import withChannel from '@/streams/middleware/withChannel';
import withDialogClose from '@/streams/middleware/withDialogClose';
import beforeShow from '@/streams/middleware/beforeShow';
import holdDialog from '@/streams/middleware/holdDialog';
import answerToRequest from '@/streams/middleware/answerToRequest';
import withWallet from '@/streams/middleware/withWallet';

export default [
  // prepares
  toBridge,
  toLoader,
  withCommit,
  withChannel,
  withAuth,
  withPermission,
  withWallet,
  // main
  beforeShow,
  withDialogOpen,
  withPayloadHandler,
  holdDialog,
  answerToRequest,
  withDialogClose,
];
