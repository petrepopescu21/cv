# CV
My personal Curriculum Vitae

## About
This app uses a Redis cache to track visitors and a Slack webhook integration in order to send notifications regarding the visitors' activity.
Each new visitor generates an UUID and receives a random name via [https://randomuser.me/](https://randomuser.me/). The information is stored in a Redis cache for future use.
The name is used to send notifications via Slack with the user's actions on the page.

## Getting started
To run this, you will need three Environment Variables. You can run this locally by creating a .env file in the root with the following info:
```
REDIS_ENDPOINT=your_redis_endpoint
REDIS_KEY=your_redis_key
SLACK_WEBHOOK=your_slack_webhook_URL
```

When ready, install npm modules and run the app
```bash
npm install
npm start
```