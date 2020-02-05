export default async function() {
  // eslint-disable-next-line global-require
  const { web3, setWeb3Network } = require('@/class/singleton/web3');

  /* eslint-disable-next-line */
  console.warn('AUTH is working on E2E MODE');

  window.Cypress = true;
  window.parent.setWeb3AuthProvider = net => {
    setWeb3Network(net);
    window.parent.web3AuthNet = net;
    window.parent.web3Auth = web3;
  };

  await window.parent.e2eBridge.awaitClientResume();

  window.XMLHttpRequest = window.parent.XMLHttpRequest;
  window.fetch = window.parent.fetch;
}
