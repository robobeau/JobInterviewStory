#Shushoku Mensetsu Monogatari

## Job Interview Story

Our protagonist, René, is on a perilous journey to save himself from the evil clutches of unemployment! It's up to you to guide him towards the sprawling downtown metropolis while avoiding the marketing dept., IT services people, and other various nerds and neckbeards out to ruin your day! Use your vast knowledge of Front End Development to take them down a notch and lead our hero to a successful job interview!

## Demo

A working demo of the game, still in progress, can be found [here](http://jis.robobeau.com).
Controls are WASD to move and Spacebar to interact.

## Project Dependencies

You will need:

* [Ruby](https://www.ruby-lang.org/en) (1.9.3 or above)
* [Node.js](http://nodejs.org) (0.10.25 or above)
* [Compass](http://compass-style.org) (0.12.0 or above)

Grunt and its dependencies will be installed via **npm install**, but here they are, anyway:

* [Grunt](http://gruntjs.com) (0.4.5 or above)
* [grunt-contrib-compass](https://github.com/gruntjs/grunt-contrib-compass) (0.8.0 or above)
* [grunt-contrib-concat](https://github.com/gruntjs/grunt-contrib-concat) (0.4.0 or above)
* [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect) (0.8.0 or above) 
* [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify) (0.5.0 or above)
* [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) (0.6.1 or above)

## Setup

Checkout the project:

```
git clone git@github.com:robobeau/JobInterviewStory.git your-project-folder-here
```

CD into the project folder and run **npm install** to install all the project dependencies:

```
cd your-project-folder-here
npm install
```

Run Grunt in order to compile the newly installed third party vendor scripts, and to serve the game:

```
grunt
```
