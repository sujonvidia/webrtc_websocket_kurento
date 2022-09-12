// StripeCheckout = Stripe('pk_test_51INpljDocUNtxmyiARVnQ0d4Pg8zjY5IBDOAUV4VUOPRMKM3vLeg5yNLvMfW56y4OYjAocIqDCOmu4FvyadZyhWD00x6VmU4rq');

var firebaseConfig = {
    apiKey: "AIzaSyClXPwwypS8uip7-9iElpofT2yQv33NmRc",
    authDomain: "workfreeli.firebaseapp.com",
    projectId: "workfreeli",
    storageBucket: "workfreeli.appspot.com",
    messagingSenderId: "69957602774",
    appId: "1:69957602774:web:72962b1df6fdeb995e2877",
    measurementId: "G-KB9S5QSFL2"
};
// var refresh_trigger = false; var sw_updated = false;
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
const publicVapidKey = "BBzhmsKELXSrRNtP4AS6KBFx9lFFDCTFQdk_nt98cR-gzMuUAtxkvjaFImaapYM2aC9_582qinO_z50tFpnKe6c";
var sw_registration;
var sw_refreshing = false;

function refresh_loc() {
    $("#reloading_page").show();
    if (sw_registration && sw_registration.waiting) {
        sw_registration.waiting.postMessage('SKIP_WAITING');
    } else {
        sw_refreshing = true;
        window.location.reload(true);
    }
    setTimeout(() => {
        // alert('time');
        sw_refreshing = true;
        window.location.reload(true);
    }, 60000);

}

navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!sw_refreshing) {
        $("#reloading_page").show();
        sw_refreshing = true;
        // alert('sw');
        window.location.reload(true)

    }
})

function invokeServiceWorkerUpdateFlow(sw_registration) {
    if (window.location.href.split('/').indexOf('alpha2') != -1) {
        $('#refresh_popup').css('display', 'flex');
    } else {
        if (window.name != 'calling') {
            if (typeof callCleanupLogic === 'function') $('#refresh_popup,#refresh_blank').addClass('testnotificationDivShow');
            else $('#refresh_popup').css('display', 'flex');
        }
        // if(sw_registration && sw_registration.waiting){
        //     sw_registration.waiting.postMessage('SKIP_WAITING');
        // } 

    }
}

function updateServiceWorker() {
    console.log('hostname:', window.location.hostname);
    if ('serviceWorker' in navigator) {
        fetch('/call/subscribe2', {
            method: 'post'
        }).then(function(response) {
            response.json().then(async function(data) {
                // debugger;
                sw_registration = await navigator.serviceWorker.register(`/service_worker.js?hash=${data.restart_time}`, {
                    scope: "/"
                });
                // detect Service Worker update available and wait for it to become installed
                if (sw_registration.waiting) {
                    // let waiting Service Worker know it should became active
                    invokeServiceWorkerUpdateFlow(sw_registration);
                }

                sw_registration.addEventListener('updatefound', () => {
                    if (sw_registration.installing) {
                        // wait until the new Service worker is actually installed (ready to take over)
                        sw_registration.installing.addEventListener('statechange', () => {
                            if (sw_registration.waiting) {
                                // if there's an existing controller (previous Service Worker), show the prompt
                                if (navigator.serviceWorker.controller) {
                                    invokeServiceWorkerUpdateFlow(sw_registration);

                                } else {
                                    // otherwise it's the first install, claim clients
                                    // invokeServiceWorkerUpdateFlow(sw_registration);
                                }
                            }
                        })
                    }
                });


                // const subscription = await sw_registration.pushManager.subscribe({
                // 	userVisibleOnly:true,
                // 	applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
                // });
                // console.log('ssbb',subscription);
                // await fetch('/call/subscribe',{
                // 	method: 'post',
                // 	headers: { 'Content-type': 'application/json' },
                // 	body: JSON.stringify({ subs: JSON.stringify(subscription), user_id: 'user_id' }),
                // 	// headers: {
                // 	// 	'content-type' : 'application/json'
                // 	// }
                // })

                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                } else {
                    firebase.app(); // if already initialized, use that one
                }
                // firebase.analytics();

                const messaging = firebase.messaging();

                // messaging.usePublicVapidKey(publicVapidKey)
                // messaging.useServiceWorker(sw_registration);
                messaging.requestPermission()
                    .then(function() {
                        // MsgElem.innerHTML = "Notification permission granted." 
                        console.log("Notification permission granted.");

                        // get the token in the form of promise
                        return messaging.getToken({
                            serviceWorkerRegistration: sw_registration,
                            // vapidKey: urlBase64ToUint8Array(publicVapidKey),
                        })
                    })
                    .then(function(token) {
                        my_token = token;
                        console.log("token is : " + token);
                        fetch('/call/subscribe_token', {
                            method: 'post',
                            headers: { 'Content-type': 'application/json' },
                            body: JSON.stringify({ token: token, user_id: user_id }),
                        })
                    })
                    .catch(function(err) {
                        // ErrElem.innerHTML =  ErrElem.innerHTML + "; " + err
                        console.log("Unable to get permission to notify.", err);
                    });

            });
        });

        // navigator.serviceWorker.getRegistrations().then(function (registrations) {
        // 	for (let sw_registration of registrations) {
        // 		sw_registration.unregister()
        // 	}
        // });

        // caches.keys().then(function(names) {
        //     console.log('caches',names);
        //     for (let name of names)
        //         caches.delete(name);
        // });

    } else {
        console.log('sw:Service workers are not supported.');
    }
}
window.addEventListener('DOMContentLoaded', () => {
    updateServiceWorker();
    // $('#paymentWidget').attr("data-amount","7000");
});