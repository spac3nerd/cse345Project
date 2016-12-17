## Introduction
This is the 345 group project. Below are instructions on how to build the project.

## Building the project

#### Linux and Mac

On Windows, I think it would be best to use a bash shell.

-Note that your distribution will likely provide node.js and git through its package manager.

You first need to install node.js on you machine. [(https://nodejs.org/)](https://nodejs.org/).

Followed by git [(http://git-scm.com/)](http://git-scm.com/).

Next, you need to install grunt:

	$ npm install -g grunt-cli
	
Afterwards, switch to /frontEnd and run:

	$ npm install
	
This will install the needed plugins the the front-end.

To build the front-end, simply run:

	$ grunt
	
This will run JSHint and then concatenate the Javascript and css sources to the dist/(js or css)/readable folders.

Next, switch to /backEnd and run:
	
	$npm install

This will install the needed plugins by the backend.

Once everything has been built properly, you can start the server by going into the backEnd directory and running:

	$node init.js

You may now go to localhost:8080 to view the application!

## Other grunt options
As previously stated, the default grunt task runs JSHint, and a concatenation of JS and CSS.
However, you may chose to run other tasks, or individual tasks.

	
#### Debug build
The debug build is the default choice when the user simply runs "grunt". The difference between production and debug besides
minification is that debug allows debugger statements in the code while production does not.

	$ grunt 
	
or

	$ grunt debug

#### Production build
The production build runs JSHint and minifies quack.js into quack-min.js which is then placed in dist/js/min.
It depends on /dist/js/readable/quack.js existing (created by debug build), and it does not allow debugger statements.

	$ grunt build
	

#### JSHint
If you simply wish to run JSHint on the source files:

	$ grunt jshint
	
#### Minification
You may chose to only run minification, but it does depend on the debug build

	$ grunt uglify
	