const linebot = require('linebot');
const firebase = require('firebase/app');
require('firebase/database');

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: 'AIzaSyCy6pjpZC-kfYhrYVxmcH5QGBdx5mSeNlg',
  authDomain: 'badminton-lintbot.firebaseapp.com',
  databaseURL: 'https://badminton-lintbot-default-rtdb.firebaseio.com',
  projectId: 'badminton-lintbot',
  storageBucket: 'badminton-lintbot.appspot.com',
  messagingSenderId: '901020926337',
  appId: '1:901020926337:web:b5b53c82898dadf3996880',
  measurementId: 'G-RLTFEJ86Y5',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

var bot = linebot({
  channelId: '1655878782',
  channelSecret: '28c67c071527315e1fe1699a5d6c12a1',
  channelAccessToken:
    'vKVtWdVQeQVrv89vhH28YEN+7AwElkVqUwmQmZuT9tyyAWbU/N7W7T9SBbT7yqpCL8B8KMV1v+ABuQ81pRFXfXmwegel6lIOn3N4maOXIBCjexClvp2vF5ZtO83IMSPAtFu8iA17KCn9rSnTF6iX5AdB04t89/1O/w1cDnyilFU=',
});

// echo user message
bot.on('message', async event => {
  let replyMsg = `${event.message.text}`;
  if (replyMsg.split(' ').length !== 2) return;
  let date = replyMsg.split(' ')[0].replace('/', '-');
  let action = replyMsg.split(' ')[1];
  event.source.profile().then(data => {
    let username = data.displayName;
    if (action.split('')[0] !== '+') return;
    database.ref(`/${date}`).push(`${username}`);
    database
      .ref(`/${date}`)
      .once('value')
      .then(result => {
        let members = Object.values(result.val());
        event
          .reply(`${date.replace('-', '/')} 揪團中！\n${members.map(x => `${x} +1\n`).join('')}`)
          .then(function (data) {
            console.log('ok');
          })
          .catch(function (error) {
            console.error(error);
          });
      });
  });
});

bot.listen('/linewebhook', 3005);
