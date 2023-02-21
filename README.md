# expo-env
Load expo environment variables using import statements for multiple env files.

# Priority Order
If you have environment variable files for test, production, and development environments, the module will load the variables from the first file it finds in the following order of priority:

```
.env.test.local
.env.local
.env.test
.env.production.local
.env.local
.env.production
.env.development.local
.env.local
.env.development
.env
```

So, for example, if you have all four files `(.env.test.local, .env.production.local, .env.development.local, and .env)` and you're running the app with `NODE_ENV=production`, the module will first look for `.env.production.local`, then `.env.local`, then `.env.production`, and finally `.env`, and it will load the variables from the first file it finds.

If you're running the app with `NODE_ENV=test`, it will first look for `.env.test.local`, then `.env.local`, then `.env.test`, and so on.