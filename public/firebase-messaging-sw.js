// /* eslint-disable no-restricted-globals */
// import { getMessaging } from "firebase/messaging";
// import { onBackgroundMessage } from "firebase/messaging/sw";

// const messaging = getMessaging();

// onBackgroundMessage(messaging, (payload) => {
//   console.log("Received background message ", payload);
//   // Customize notification here
//   const notificationTitle = "⏳ Log Hours";
//   const notificationOptions = {
//     body: "Time to log your hours in ClockSnap. Click here",
//     icon: "./assets/android-chrome-192x192.png",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// // listen for the notificationclick event
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close(); // close the notification

//   event.waitUntil(
//     self.clients
//       .matchAll({
//         type: "window",
//         includeUncontrolled: true,
//       })
//       .then((windowClients) => {
//         const clockSnapClient = windowClients.find(
//           (client) =>
//             client.url === "https://clock-snap.web.app" && "focus" in client
//         );

//         if (clockSnapClient) {
//           return clockSnapClient.focus();
//         } else {
//           return self.clients.openWindow("https://clock-snap.web.app");
//         }
//       })
//   );
// });
