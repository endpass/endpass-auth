import toBridge from './toBridge';
import toLoader from './toLoader';
import withAuth from './withAuth';
import withPermission from './withPermission';
import withPayloadHandler from './withPayloadHandler';
import withCommit from './withCommit';
import withDialogOpen from './withDialogOpen';
import withChannel from './withChannel';
import withDialogClose from './withDialogClose';
import beforeShow from './beforeShow';
import holdDialog from './holdDialog';
import answerToRequest from './answerToRequest';

export default [
  // prepares
  toBridge,
  toLoader,
  withCommit,
  withChannel,
  withAuth,
  withPermission,
  // main
  beforeShow,
  withDialogOpen,
  withPayloadHandler,
  holdDialog,
  answerToRequest,
  withDialogClose,
];
