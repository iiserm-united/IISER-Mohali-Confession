// firebase-config.js
const firebaseConfig = {
  apiKey: "ACTUAL_API_KEY_HERE",
  authDomain: "ACTUAL_AUTH_DOMAIN_HERE",
  databaseURL: "ACTUAL_DATABASE_URL_HERE",
  projectId: "ACTUAL_PROJECT_ID_HERE",
  storageBucket: "ACTUAL_STORAGE_BUCKET_HERE",
  messagingSenderId: "ACTUAL_MESSAGING_SENDER_ID_HERE",
  appId: "ACTUAL_APP_ID_HERE"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
