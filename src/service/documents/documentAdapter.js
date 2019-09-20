export default function documentAdapter(item) {
  const doc = {
    ...item,
    imgPath: `${ENV.VUE_APP_IDENTITY_API_URL}/documents/${item.id}/front/file`,
    imgPathBack: `${ENV.VUE_APP_IDENTITY_API_URL}/documents/${item.id}/back/file`,
  };

  return doc;
}
