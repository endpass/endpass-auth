export default function answerToRequest(options, action) {
  if (action.result !== undefined) {
    action.req.answer(action.result);
  }
}
