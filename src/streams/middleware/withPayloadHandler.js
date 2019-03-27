import { Answer } from '@/class';

export default async function withPayloadHandler(options, action) {
  const { payloadHandler } = options;
  if (!payloadHandler) {
    return;
  }

  let res;
  try {
    const data = await payloadHandler(action.payload);
    res = Answer.createOk(data);
  } catch (e) {
    res = Answer.createFail();
  }
  action.setResult(res);
}
