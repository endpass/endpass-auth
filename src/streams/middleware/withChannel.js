export default async function withChannel(options, action) {
  if (!options.channel) {
    return;
  }

  // TODO: for skip auth result (ex. account)
  (async () => {
    const res = await options.channel.take();
    action.setResult(res);
  })();
}
