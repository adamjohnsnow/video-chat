## Adam's README

#### Infra

- Singlepage prgressive web-app on Next.JS framework, React with TypeScript
- Firebase for DB
- AWS Chime for video calling

#### Running locally

Once you have a local clone of the repo, you will need to install dependencie with `yarn install` and inlcude an `.env.local` file with the following credentials for access to AWS and Firebase:

```
AWS_ACCESS_KEY_ID=[YOUR KEY ID]
AWS_SECRET_ACCESS_KEY=[YOUR SECRET]
AWS_REGION=eu-west-2
NEXT_PUBLIC_TABLE_NAME=else-video-calling // or other project table
NEXT_PUBLIC_FIREBASE_URL=https://else-video-calling-default-rtdb.firebaseio.com/ // or other project url
NEXT_PUBLIC_FIREBASE_PROJECTID=else-video-calling  // or other project ID
```

To run the dev environment, you can use `yarn dev`` and visit [localhost 3000](http://localhost:3000)
