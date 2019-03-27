export default function withCommit(options, action) {
  if (options.commit) {
    options.commit(action.payload);
  }
}
