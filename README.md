# openwhisk-canirequire

What node modules can I require in my OpenWhisk actions? Find out with a OpenWhisk action :)

This is based on the work done at github.com/tehsis/webtaskio-canirequire licensed under ISC.

It uses one [OpenWhisk action](actions/list_modules.js) to retrieve the modules available
to the node environment where the task is running. It caches the list of modules for one hour.

## Running the app on Bluemix

1. Clone the app to your local environment from your terminal

1. Obtain your OpenWhisk access key at https://new-console.ng.bluemix.net/openwhisk/

1. Armed with your access key, create a OpenWhisk (user-provided) service 

   ```
   $ cf cups whisk -p url
   
   url> https://<YOUR-ACCESS-KEY-HERE>@openwhisk.ng.bluemix.net/
   ```

1. Push the application to Bluemix.

   ```
   $ cf push
   ```

## Running the app locally

1. Get all dependencies with

   ```
   npm install
   ```

1. Create a file named ```vcap-local.json``` in the app directory with the following content, replacing the url with your whisk installation:

  ```
  {
    "services": {
      "whisk": [
        {
          "name": "whisk",
          "credentials": {
            "url": "https://<YOUR-ACCESS-KEY>@openwhisk.ng.bluemix.net"
          }
        }
      ]
    }
  }
  ```

1. Run the application

  ```
  npm start
  ```

---

This is a sample application created for demonstration only.
The program is provided as-is with no warranties of any kind, express or implied.
