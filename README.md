# CV
My personal Curriculum Vitae

This app uses a Redis cache to track visitors and a Slack webhook integration in order to send notifications regarding the visitors' activity.

To run this, you will need three Environment Variables. You can run this locally by creating a .env file in the root with the following info:
```
REDIS_ENDPOINT=your_redis_endpoint
REDIS_KEY=your_redis_key
SLACK_WEBHOOK=your_slack_webhook_URL
```

## Getting started
Run the following commands
```bash
npm install
npm start
```