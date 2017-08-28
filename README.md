# Deeson frontend tooling

This project is the wiring for our frontend process.

This only works as part of our opinionated [Drupal 8 quickstart recipe](https://github.com/teamdeeson/d8-quickstart).  This receipe comes with our frontend preconfigured and ready to go in the `src/frontend` folder.

If you are new to this, then the best place to start is our [example project](https://github.com/teamdeeson/cdd-demo) you can checkout and start working with in a few short steps.

### Running under Docker

Two Docker containers are required for this to work, one for node and one for php.

The fe-node container comes with the yarn package manager. On startup it will check the state of your package.json file and update your node dependencies accordingly. Once finished it fires up webpack.

The fe-php container should come with composer but doesn't so it gets installed on start up. It then checks the contents of your composer.json file and installs all php dependencies accordingly. Once finished it fires up a basic PHP webserver for rendering your twig templates.

```fe-node container

fe-node:
  image: node:7
  working_dir: /app
  labels:
    - 'traefik.backend=fe-node'
    - 'traefik.port=80'
    - 'traefik.frontend.rule=Host:frontend.localhost'
  volumes:
    - ./src/frontend:/app
  command: sh -c 'yarn install && yarn start'
```

```fe-php container

fe-php:
  image: php:7
   working_dir: /app
   depends_on:
    - "fe-node"
  volumes:
    - ./src/frontend:/app
  command: bash -c "curl --silent --show-error https://getcomposer.org/installer | php && php composer.phar install && php -S 0.0.0.0:80 node_modules/.bin/deeson-router-php"
```

### File naming and indexes

From your project root there should be a folder at `src/frontend` which is where your frontend code will go.
There should be a pages directory in `src/frontend` for your static twig pages.
There will be an assets directory in `src/frontend` which contains the compiled assets.
Files in pages dir need to have a `.twig.html` or `.php.html` extension if you want to
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

#### Drupal 8

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

### Referencing images from templates and styles
For the examples below, assume a component tree like this one:
```
src/
├── app.js
└── components
    └── someComponent
        ├── index.js
        ├── index.scss
        ├── some-component.html.twig
        ├── large-image.jpg
        └── small-image.svg
```

#### …from SASS
Referencing images from SASS is handled automatically. You can reference images from the relative path to your SASS file.
So in the above example, from index.scss you could reference `small-image.svg` with a rule like this one:
 
```
div {
  background: url('./small-image.svg');
}
```

Small images (at time of writing the actual limit is  below 1000 bytes) will be inlined as a data url.
Larger files are emitted to the assets directory with the url reference being maintained.
 
#### …from a template
Referencing images from the template is a little more complicated because Webpack cannot interpret the twig and php files we create.
To reference an image from a template you'll have to do two things:

1. `import` the file. So in `index.js`, you would have a line that looked like `import "./large-image.jpg"`.
  
2. In the template itself, use an absolute path, prefixed with `{{ base_path }}{{ directory }}/assets/`. 
So to reference `large-image.jpg` from above you would have something like this:
`<img src="{{ base_path }}{{ directory }}/assets/components/someComponent/large-image.jpg" />`

Both Drupal 7 and 8 can provide these variables, so for 7 you can replace with 
`<?php print $base_path . $directory; ?>`.

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

