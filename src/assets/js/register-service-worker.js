const registerServiceWorker = () => {
  if (!('serviceWorker' in window.navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    window.navigator.serviceWorker
      /* eslint-disable no-undef */
      .register(`${URL}service-worker.js`)
      /* eslint-enable no-undef */
      .then(registration =>
        console.log(
          `✅ Service worker is registered with scope: ${registration.scope}`
        )
      )
      .catch(err =>
        console.log(`🔥 Service worker registration failed: ${err.message}`)
      );
  });
};

registerServiceWorker();
