export default async function beforeShow(options) {
  if (options.beforeShow) {
    await options.beforeShow();
  }
}
