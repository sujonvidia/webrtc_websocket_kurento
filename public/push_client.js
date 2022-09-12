const publicVapidKey = "BBzhmsKELXSrRNtP4AS6KBFx9lFFDCTFQdk_nt98cR-gzMuUAtxkvjaFImaapYM2aC9_582qinO_z50tFpnKe6c";
// navigator.serviceWorker.getRegistrations().then(function(registrations) {
//   for(let registration of registrations) {
//    registration.unregister()
//  } });

// if ('serviceWorker' in navigator) {
//   fetch('/call/subscribe2', {
//       method: 'post'
//     }).then(function (response) {
//       response.json().then(function (data) {
//         console.log('sw:subscribe:', 'sw'+data.restart_time);
//         navigator.serviceWorker.register(`/service_worker.js?hash=${data.restart_time}`, { scope: "/" })
//         .then(function(registration) {
//           notifyMe();
//           registration.addEventListener('updatefound', function() {
//             // If updatefound is fired, it means that there's
//             // a new service worker being installed.
//             var installingWorker = registration.installing;
//             console.log('sw:A new service worker is being installed:',
//               installingWorker);

//             // You can listen for changes to the installing service worker's
//             // state via installingWorker.onstatechange
//           });
//         })
//         .catch(function(error) {
//           console.log('Service worker registration failed:', error);
//         });
        
//       }); 
//     })
  
// } else {
//   console.log('sw:Service workers are not supported.');
// }

function notifyMe() {
  if (!("Notification" in window)) { // Let's check if the browser supports notifications
    console.log("This browser does not support desktop notification");
  }
  else if (Notification.permission === "granted") {// Let's check whether notification permissions have alredy been granted
    // registerPushService(); // If it's okay let's create a notification
  }
}
function registerPushService(){
  // navigator.serviceWorker.ready.then(function (registration) {
  //   return registration.pushManager.getSubscription()
  //     .then(function (subscription) {
  //       if (subscription) { return subscription; }
  //       return registration.pushManager.subscribe({
  //         userVisibleOnly: true,
  //         applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  //       });
  //     })
  //     .then(function (subscription) {
  //       return fetch('/call/subscribe', {
  //         method: 'post',
  //         headers: { 'Content-type': 'application/json' },
  //         body: JSON.stringify({ subs: JSON.stringify(subscription), user_id: user_id }),
  //       });
  //     });
  // });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}