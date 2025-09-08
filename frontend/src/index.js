// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const colRef = collection(db, 'trafficStats');

getDocs(colRef).then(snapshot => {
    let stats = [];
    snapshot.docs.forEach(doc => {
      stats.push({"id":doc.id ,...doc.data()});
    });
    console.log(stats);
})
.catch(err => {
  console.log(err.message);
})

const analytics = getAnalytics(app);