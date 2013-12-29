# Girder-Ghost Theme [(Blog)](http://ghost.fredmaya.com)
This is a startup theme for the Ghost platform. Its also a theme development environment I use to play with NodeJS, Sass, [Girder](https://github.com/unmaya/Girder) and other neat tools made for Javascript apps. I use it as a starting template for themes and other experiments.

## Using the theme
All you need to do is copy the files in this repo to the theme folder in your Ghost installation: ```/content/themes/girder-ghost/```. Enable the theme in the admin panel then you can add your own background, logo, etc...

## Development Mode (for the ninja in you)
The source files are included in the ```/_source/``` folder. This theme's development environment requires Grunt `~0.4.0`. The project already contains a Gruntfile.js pre-configured to test, build and release using an asset pipeline. To get started check that you have the dependencies required to build the project, then you'll need to install the NPM modules and bower components:

```shell
sudo npm install
```
Depending on your setup you may or may not need to also issue these commands:
```shell
bower install
sudo bundle install
```

## Environment dependencies
You'll need Ruby (`v1.9.x` and up), to check Ruby is installed on your machine use `ruby -v`. Other Dev dependencies include:

- Bundler (Ruby gem package manager)
- NodeJS 0.10x
- Bower
- Compass / Sass
- Breakpoint Gem

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to install and use Grunt plugins.