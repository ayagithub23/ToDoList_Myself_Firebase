// Initialize Firebase
var config = {
    apiKey: "AIzaSyAcCpJIoXS7GD1mG6WHjbLf1qwVFACWCew",
    authDomain: "fir-start-d2f98.firebaseapp.com",
    databaseURL: "https://fir-start-d2f98.firebaseio.com",
    projectId: "fir-start-d2f98",
    storageBucket: "fir-start-d2f98.appspot.com",
    messagingSenderId: "45314225260"
};
firebase.initializeApp(config);

// const 無法更動 
const database = firebase.database();