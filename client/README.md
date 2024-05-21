# Wordmash Client

A React Client for the Wordmash Application

## Dev Usage

Clone the repo, install dependencies, provide an API URL, start the project:  
  
```bash
$ git clone git@github.com:/chazapp/wordmasher
...
$ cd wordmasher/client
$ yarn install
...
$ echo "REACT_APP_API_URL=http://localhost:8008" >> .env
$ yarn start
```


## Production build
  
A Dockerfile is available for production environments. This image requires you to mount an `env.js`
file in the container's `/usr/share/nginx/html/env.js` path, containing the API URL for the application,
such as:

```js
window.env = {
    API_URL: "https://your-api-url",
    VERSION: "vX.X.X"
}
```

An Helm Chart is also available to deploy on Kubernetes clusters.  
