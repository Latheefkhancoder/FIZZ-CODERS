const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const serviceAccountPath = path.join(
    __dirname,
    "../../credentials/fizz-connect-firebase-adminsdk-fbsvc-3aa8a69bac.json"
);

const app =
    getApps().length === 0
        ? initializeApp({
            credential: cert(require(serviceAccountPath)),
        })
        : getApps()[0];

const db = getFirestore(app);

module.exports = {
    db,
};