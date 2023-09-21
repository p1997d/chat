var firebase = require( 'firebase' ),
	auth = require( 'firebase/auth' );

var firebaseConfig = {
    apiKey: "AIzaSyDRwyrtOT3FI-3Ru3X6S7AtT9yuYLJGeyQ",
    authDomain: "socket-io-test-20210814.firebaseapp.com",
    databaseURL: "https://socket-io-test-20210814-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "socket-io-test-20210814",
    storageBucket: "socket-io-test-20210814.appspot.com",
    messagingSenderId: "687086813289",
    appId: "1:687086813289:web:5adfe35bc42ce5fda822f8"
};
firebase.initializeApp( firebaseConfig );
var database = firebase.database(),
	storage = firebase.app().storage( 'gs://socket-io-test-20210814.appspot.com' );
	
module.exports.database = database;
module.exports.storage = storage;