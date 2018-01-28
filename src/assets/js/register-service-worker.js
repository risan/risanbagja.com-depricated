const registerServiceWorker = () => {
  if (!('serviceWorker' in window.navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    /* eslint-disable no-undef */
    window.navigator.serviceWorker.register(`${URL}service-worker.js`);
    /* eslint-enable no-undef */
  });
};

registerServiceWorker();
