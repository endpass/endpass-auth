import signer from '@/class/singleton/signer';

export default async function() {
  // eslint-disable-next-line global-require
  const web3 = await signer.getWeb3Instance();

  /* eslint-disable-next-line */
  console.warn('AUTH is working on E2E MODE');

  window.Cypress = true;
  window.parent.setWeb3AuthProvider = net => {
    signer.setWeb3Network(net);
    window.parent.web3AuthNet = net;
    window.parent.web3Auth = web3;
  };

  await window.parent.e2eBridge.awaitClientResume();

  window.XMLHttpRequest = window.parent.XMLHttpRequest;
  window.fetch = window.parent.fetch;
}
