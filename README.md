# Deeson frontend tooling (working title)

This project pulls together our evolving frontend toolkit into one (yarn|npm)able module.

## Getting Started

To add useful things we can all benefit from just fork and add away.

### Prerequisites

If you want to build components and arn't too worried about the drupal integration bit then you'll need :

* [node](https://nodejs.org) - also a fairly recent version runnable from the console
* [npm](https://npmjs.com) or [yarn](https://yarnpkg.com) (we've been using yarn)
* [php](https://php.net) - a fairly recent version runnable from a console
* if you are planning on delivering components to drupal 8 you'll also need [composer](https://getcomposer.org/)

For drupal integration you will also need :

* [drupal](drupal.org) - 7 or 8 depending on your requirements
* a little patience

### Installing

1. Make yourself a fresh directory and `yarn init` inside it. Follow all the normal npmish instructions.
2. `yarn add https://github.com/teamdeeson/deeson-webpack-config`
3. If you are going to need twig templates (drupal 8 or any number of other setups) then you should `composer require twig/twig` too
4. Open up your `package.json` and add the following to the `scripts` section
   ```javascript
   "start": "./node_modules/.bin/frontend-serve",
   ```
5. Make yourself a `webpack.config.js` file that looks like this
   ```javascript
   const config = require('deeson-webpack-config-starter');

   // this should be the real asset path in drupal
   // so something like /sites/all/themes/blah_blah/assets
   config.output.publicPath = '/assets/';

   // this is how you get auto reload happening
   // for your pages without adding them to ./src/app.js
   config.entry.pages = './pages/index.js';

   module.exports = config;
   ```

At this point we are pretty much ready to go. We just need a couple more files.

1. An entry point for webpack, our default is `src/app.js`
   ```javascript
   console.log('hello')
   ```
2. An index page that we can add our components to so we can make them awesome, `pages/index.php` or `pages/index.twig`.
   ```html
   <!doctype html>
   <html>
     <head>
       <link rel="stylesheet" href="{{ directory }}/assets/app.css">
       <script type="text/javascript" src="{{ directory }}/assets/app.js"></script>
     </head>
     <body>
       <h1>index.php</h1>
     </body>
   </html>
   ```
3. Another entry point for webpack so it can watch our development pages (this is a bit of a work in progress to give us live reload), our default is `pages/index.js`.
   ```javascript
   import './index.php'
   ```

That should be all we need to get going. `yarn start` and visit `https://localhost:8080/pages/index.php`. Now get creating.

### File naming and indexes
You'll want to make sure that your pages all go in to a `/pages` dir (and compiled assets go into `/assets`). 
Files in `/pages` need to have a `.twig.html` or `.php.html` extension if you want to 
be able to make a static version of your site. Our router is set up to handle 
these extensions just fine, but you may need to configure them in your IDE if 
you want syntax highlighting.

Files elsewhere (such as under `/src`) should not add the `.html` suffix.

The router also provides basic autoindexing support by redirecting / to 
/index.twig.html automatically but static hosting environments are unlikey to 
support that behaviour so please use full urls in hyperlinks.   

### Drupal Integration

Our webpack [plugin](https://webpack.js.org/concepts/plugins/) keeps track of all our template related files during build and outputs a bit of php at the end that lets us do the following.

#### Seven and Eight

Inside of a themes `template.php` for 7 and `<theme>.theme` for 8 (and assuming you output assets to /assets/)
```php
require_once __DIR__ . '/assets/component-templates.php';

function <yourtheme>_theme() {
  // for 7
  return deeson_tpl_component_templates();
  // or for 8
  // return deeson_twig_component_templates();
}
```

This sets up each of your components as a template callable in the same way you would anywhere else.
```php
// render array
function some_sort_of_preprocess(&$vars) {
  $vars['content'][] = [
    '#theme' => 'yourcomponent',
    '#content' => ['arguments' => 'in here'],
  ];
}

// drupal 7 theme function
<?php print theme('yourcomponent', ['content'=>['arguments'=>'in here']]); ?>
```

#### Eight only

We make use of the [components](https://www.drupal.org/project/components) module to set us up with a namespace to reference our components from. So once you have it installed stick something like the following in `<yourtheme>.info.yml`
```yml
component-libraries:
  components:
    paths:
      - assets/components
```

This will allow you to reference components directly from templates
```twig
{% include '@components/mycomponent/mycomponent.html.twig' with {content: {arguments: 'in here'}} %}
```

### Static builds
You can create a static export of your application for deployment to pretty much 
any webserver using the `deeson-static-build` script.

Call it like this:

`./node_modules/.bin/deeson-static-build /dir/to/output /base/url/prefix`

Where `/dir/to/output` is the path where you'd like the compiled assets placed.</br>
And `/base/url/prefix` is the path from which the site will be served.

E.g. if you were hosting on https://static.example.com/our-site, then your 
command might look like this:
 
`./node_modules/.bin/deeson-static-build /var/www/vhosts/static.example.com/our-site /our-site`

The second URL prefix parameter is injected into your templates as `{{ directory }}`.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

