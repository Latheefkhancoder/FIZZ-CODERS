const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Load environment variables (dotenv may already be loaded by env.js, but safe to call again)
require("dotenv").config();

let db = null;

try {
    let app;

    if (getApps().length === 0) {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        // Only use service account if all vars are set AND not placeholder values
        const hasRealCredentials =
            projectId &&
            clientEmail &&
            privateKey &&
            !projectId.includes("your-firebase") &&
            !privateKey.includes("YOUR_PRIVATE_KEY_HERE");

        if (hasRealCredentials) {
            // Use service account credentials from environment variables
            app = initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    // Replace escaped newlines (\n) that come from storing multi-line
                    // private keys as a single-line env var string
                    privateKey: privateKey.replace(/\\n/g, "\n"),
                }),
            });
        } else {
            // Fallback: Application Default Credentials (works on Google Cloud,
            // or locally after: gcloud auth application-default login)
            // Still pass projectId so Firestore knows which project to use
            console.warn(
                "[Firebase] Service account env vars not configured — " +
                "attempting Application Default Credentials (ADC)."
            );
            app = initializeApp(projectId && !projectId.includes("your-firebase")
                ? { projectId }
                : {}
            );
        }
    } else {
        app = getApps()[0];
    }

    db = getFirestore(app);
    console.log("[Firebase] Firestore initialized successfully.");
} catch (err) {
    console.error(
        "[Firebase] ⚠️  Could not initialize Firestore:", err.message,
        "\n[Firebase] Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in backend/.env"
    );
    // db remains null — Firestore-dependent routes will return errors at runtime
    // until FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY are set in .env
}

module.exports = {
    db,
};