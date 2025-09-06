5Ws and 1H is a method used in journalism and investigations to summarize stories by answering six key questions: What,
Who, Why, When, Where, and How. This approach helps reporters and investigators quickly get to the heart of a story,
covering all the essential details in a clear and simple way.

# Architecture

**SixQs** is a Web App designed to help you quickly extract the key facts from any article. It uses LLM
powered by `Gemini` within a `NodeJs` Backend to extract the six key questions. It then includes more details like
definitions and a quick text summary.

> For both `the webapp (on root)` and `the backend on /backend`, make sure to run the command `npm install`

## The Web App

Represents the front end of the project, user copy and pastes the URL and sends it to the backend to
summarize (when requested by the user). The web app is built with `Angular` with the following components:

- **LoginComponent** and **RegisterComponent** handling authentication actions.
- **HomeComponent** showing the History of summarizations and newly summarized articles.
- **AccountComponent** handles all user actions like updating password, getting new credits and deleting account.

For the logic side:

- The web app uses `IndexedDatabase` to cache locally account details and summarized articles for quick access.
- It also uses `WikiPedia` to get extra details about some words.

To build the project (for hosting), run the command `npm run build`, you can find the results on `/dist`.

# The Backend

The backend is split into 2 sections:

- `Firebase` handling both **Authentication** and Remote Database (with **Firestore**). To set up Firebase, you need to first create
  a **Firebase Project** then create a **Web Application** and copy the `FirebaseConfig` constant and put it in a new file created on root
  and called `firebase-config.js`.

```typescript
// put this in a new file called firebase-config.js
// while setting up the Web App (on Firebase), you will find this constant ready, just copy paste it (and make sure the name is correct)
export const FirebaseConfig = {
  apiKey: "<your api key>",
  authDomain: "<your authDomain>",
  projectId: "<your projectId>",
  storageBucket: "<your storageBucket>",
  messagingSenderId: "<your messagingSenderId>",
  appId: "<your app id>",
  measurementId: "<your measurementId>",
};
```

- The agent responsible for summarizing the articles, to build it go to `/backend` and run the command `npm run build`.
  You can find the results on `backend/lib`. The agent needs to access Firestore, to do so follow these instructions in your Firebase Project:

```
    - go to Project Settings > Service accounts
    - Click on "Generate new private key"
    - Rename the genrated key to "firebase-creds.json"
    - Copy/Paste the key file into "backend/"
```

Also, don't forget to add the .env file with the Gemini API Key

```
    - Create a ".env" file on "backend"
    - Add the Gemini API Key: "GEMINI_API_KEY=<your Gemini api key, you can generate in https://aistudio.google.com/apikey>"
```

Once you build the project, don't forget to copy/paste the `firebase-creds.json`, `.env` and `package.json` into `lib/`.
