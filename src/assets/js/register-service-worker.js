const registerServiceWorker = () => {
  if (!'serviceWorker' in navigator) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${URL}service-worker.js`)
      .then(registration =>
        console.log(`✅ Service worker is registered with scope: ${registration.scope}`))
      .catch(err => console.log(`🔥 Service worker registration failed: ${err.message}`));
  });
}

registerServiceWorker();
