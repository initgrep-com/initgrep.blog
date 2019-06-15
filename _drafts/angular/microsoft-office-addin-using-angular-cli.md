---

layout: post
bannercolor: "light-green accent-3"
title:  "Create Microsoft Office Addin using Angular CLI"
date:   2018-07-03
meta: " Develop a Microsoft outlook add-in using angular v8. Use Angular CLI to generate a complete project. Add SSL to angular dev server"
excerpt: "Develop a Microsoft outlook add-in using angular v8. Use Angular CLI to generate a complete project and add SSL to angular dev server"
category: angular
comments: true
author: "sheikh irshad"
twitter: imshykh    
facebook: irshsheikh
github: igagrock
image: directive1.jpg

---


If you are reading this tutorial, you are probably one of the developers out there trying to figure out how to create a Microsoft office add-in using Angular CLI.

Microsoft provides the complete process for creating add-ins using angular through a yeoman generator for VS Code editor. This method works fine but it uses the manual webpack config with angular. I also faced  issues such as:

- **not able to use template-url in  angular components**
- **no support for CSS files for each angular components**


The goal of this tutorial is to demonstrate a way of creating a project structure using angualar@8.0.0 CLI, configure it and make it ready for developing office add-ins.


_Please note, It still does not support the `office-addin-debugger` plugin provided by Microsoft. I have added it as an npm dev-dependency here and I am still trying to figure how to make it work. But you can always debug the add-in on the web app such as outlook web._

> I assume you have `node` and `npm` already installed



Let us being --


## Generate Office add-in angular app using yeoman generator

  Office [official docs](https://docs.microsoft.com/en-us/outlook/add-ins/quick-start?tabs=visual-studio-code) have provided detailed steps. I will only provide concise steps.

- Run the following command in the command line. It will install the office Yeoman generator.
    ```
      npm install -g yo generator-office
    ```
- Generate the office adding angular project structure using the below command.
    ```
      yo office --skip-install
    ```
    The above command will provide interactive input. Choose the below options  

      ```js
         Choose a project type: (Use arrow keys) 
         // choose (2) Office Add-in Task Pane project using Angular framework

         Choose a script type: (Use arrow keys)
         // choose (1) Typescript
        
         What do you want to name your add-in? (My Office Add-in) 
         //Give any name you want. for this tutorial, I would keep demo-addin

         Which Office client application would you like to support? 
         //choose (3) Outlook

      ```

    Notice `--skip-install` argument. Well, We don't want `npm` to install all the dependencies here. We would only need `manfiest.xml` file and some of the Microsoft office dependencies from package.json.

Our outlook addin project structure is done using yeomen generator. Below is the structure of the generated project.

```
    .
    ├── assets
    │   ├── icon-16.png
    │   ├── icon-32.png
    │   ├── icon-80.png
    │   └── logo-filled.png
    ├── CONTRIBUTING.md
    ├── LICENSE
    ├── manifest.xml
    ├── package.json
    ├── package-lock.json
    ├── README.md
    ├── src
    │   ├── commands
    │   └── taskpane
    ├── tsconfig.json
    └── webpack.config.js

```





## Creating an angular application using Angular CLI

- Install the Angular CLI 

  ```
    npm install -g @angular/cli
  ````
- Generate an angular app 

  ```
    ng new demo-angular-addin
  ```
- Run `ng serve` to make sure the app is working


The structure of our angular app would look like below:

```
      .
      ├── angular.json
      ├── e2e
      ├── node_modules
      ├── package.json
      ├── package-lock.json
      ├── README.md
      ├── src
      ├── tsconfig.json
      └── tslint.json


```

## Copy the addin manifest to the angular application

 Copy the `manifest.xml` from demo-addin which we generated using yeomen generator and paste it in the root folder of the angular app.

## Change the angular application default port number

Notice that the `manifest.xml` has all the mappings for port 3000 such as `localhost:3000`. Also, the angular application default port is 4200. We either have to change the port in manifest or change angular server port. Either way, it should work.

Let us change the default port(4200) of the angular app to 3000. Open `angular.json` file and look for `server` key and changed the default port. Below is an example.

```js

 "serve": {
     "builder": "@angular-devkit/build-angular:dev-server",
     "options": {
         "browserTarget": "demo-angular-addin:build",
         "port": 3000
    },
    "configurations": {
                "production": {
        "browserTarget": "demo-angular-addin:build:production",
        "port": 3000
                }
    }
   },
```

 Run `ng-serve` to validate the port.


## Copy the default icons from generated office addin to angular app

The default icons provided are configured in addin manifest. These icons will be shown when the add-in is loaded.

If both the projects are in the same folder, use the below command or do it manually.

```
  cp -r demo-addin/assets/* demo-angular-addin/src/assets/
```

## Update the manifest mapping -- replace with index.html page

In the `manifest.xml `, for each occurrence of `taskpane.url` or any other locations where the URL resembles like `https://localhost:3000/taskpane.html`, update **taskpane.html** to **index.html**. You can also remove the taskpane.html and only keep host: port (localhost:3000) only.


## Configure SSL for the angular application

It is mandatory for Microsoft Office add-ins to be served over `https` connection. We need to generate an SSL certificate and key and configure our angular application to serve over `https`.

Go to this tutorial titled  [Running Angular CLI over HTTPS with a Trusted Certificate](https://medium.com/@rubenvermeulen/running-angular-cli-over-https-with-a-trusted-certificate-4a0d5f92747a). It has all the steps to configure SSL in an angular application. 

If you still face any issues, try to install the certificate by choosing `local machine`.
 and use the SSL options directly in the terminal.
  
  ```
  ng serve --ssl true --ssl-cert "ssl/server.crt" --ssl-key "ssl/server.key"
  ```

You can also configure the same command in `package.json` inside scripts -- such as :

```
"start-ssl" : "ng serve --ssl true --ssl-cert \"ssl/server.crt\" --ssl-key \"ssl/server.key\""
```

## Change the Typescript compiler target type to es5 instead of es2015 

While I was testing the Outlook addin for the desktop app, it did not load angular components. However, It was working fine in the outlook web app. I initially posted a [stackOverFlow question](https://stackoverflow.com/questions/56600059/microsoft-office-addin-for-outlook-does-not-load-on-outlook-desktop-app). After thorough debugging, I was able to figure out that Outlook desktop app does not support `es2015` yet.

Let's update `tsconfig.app.json` and add the new target under `compilerOptions`.

```js
  "target": "es5"
```

## Add the missing dependencies and dev-dependencies using npm

##### npm dependencies

```
  npm install --save @microsoft/office-js @microsoft/office-js-helpers@^1.0.1 office-ui-fabric-js@^1.3.0
```

I have added `office-js` also as an npm dependency. However, `office js` is not a valid es6 module and it can not be used as such.
We still need to load it using script tags from CDN. We will get to it later in the tutorial.
You can also keep track of this issue [here](https://github.com/Microsoft/TypeScript/issues/11420). If it is updated as an es6 module in the future, you can directly use it by importing in components rather loading it from CDN.

##### npm devdependencies

```
  npm install --save-dev @types/office-js@^1.0.1 @types/office-runtime@^1.0.7 office-addin-debugging@^2.1.13 office-addin-dev-certs@^1.0.1 office-toolbox@^0.1.1
```


##### Add the missing types

During compilation, Typescript compiler is going to complain about missing types. Since we will be using Microsoft Office APIs during development, we will need to add office-js to types.

Update the `tsconfig.app.json` and add `office-js` under the `types` array.

```js
   "types": [
      "office-js"
   ]
```

## Copy the script from taskpane.html to index.html

As mentioned earlier, Office-js has to be added from CDN. Along with it, if you intend to use office `fabric-ui` for developing the addin user interface, include the fabric libraries from CDN.

```html

   <!-- Office JavaScript API -->
   <script type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js"></script>

   <!-- For more information on Office UI Fabric, visit https://developer.microsoft.com/fabric. -->
   <link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.4.0/css/fabric.min.css" />
   <link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.4.0/css/fabric.components.min.css" />

   <script src="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.4.0/js/fabric.min.js"></script>

```

## Bootstrap the angular application inside the `Office.initialize` function.

`Office.initialize` makes sure the addin is loaded after the Office application has completely loaded.

let's update the `main.ts` file by wrapping the bootstrap code inside the `initialize` function.

```js

   Office.initialize = reason =>{

       platformBrowserDynamic().bootstrapModule(AppModule)
                               .catch(err => console.error(err));
   };
```

The only thing left now is to side-load our Microsoft Outlook addin. You can find it in official documentation [here](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins)

Happy codding--
