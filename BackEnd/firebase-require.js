const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Use service account if needed
    credential: admin.credential.cert(serviceAccount),

  });
} else {
  admin.app(); // If already initialized, use the default app
}

module.exports = admin;


