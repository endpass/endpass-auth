export default async function holdDialog(options, action) {
  if (!options.channel || action.result !== undefined) {
    return;
  }

  await options.channel.take();
}
