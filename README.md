# Templating Boilerplate

## Create static websites with HTML modules.

Features:
* Sass/SCSS
* Handlebars templating
* ES6 minification & bundling
* Live reload with BrowserSync 

### Getting Started

Clone the repo using `git clone` or by clicking the *Download ZIP* button to the right.

```sh
git clone https://github.com/dpw1/templating-boilerplate.git
```

Navigate to the directory to where it was cloned.

Install all dependencies using npm:

```sh
npm install
```

Run the default Gulp task to get started:

```sh
gulp
```

BrowserSync will automagically inject any changes you make to the stylesheets. You can view the website at one of the given access URLs:

```sh
[BS] Access URLs:
 ----------------------------------
       Local: http://localhost:3000
    External: http://10.0.X.XX:3000
 ----------------------------------
```

If you are working within a GitHub repo you can deploy your project, at any time, to a `gh-pages` branch by running:

```sh
gulp deploy
```

### Extras

#### UNCSS

You can also remove all the un-used CSS by running the following command. It doesn't work with browsersync and should not be used during development. Use it once every deploy. :)

```sh
gulp uncss
```

### Credits

- https://github.com/jadnco/static-boilerplate

