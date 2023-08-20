// Gerando uma animação no Three.JS 

import * as THREE from 'three';

import { GUI } from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js';

const 	gui 			= new GUI();
const 	clock 			= new THREE.Clock();
const 	rendSize 		= new THREE.Vector2();
var  	bgColor 		= new THREE.Color(0x000000);
var		bgPreviousColor	= new THREE.Color(0x000000);
var		bgNextColor 	= new THREE.Color(0xFF0000);

var 	controls, 
		scene,
		camera,
		renderer,
		animeID;

var 	oldTime 	= 0;


// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(bgColor);

	rendSize.x = 
	rendSize.y = Math.min(window.innerWidth, window.innerHeight) * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	window.addEventListener ( 'resize', onWindowResize 	);

	scene 	= new THREE.Scene();

	initGUI();

	camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -1.0, 1.0 );
	
	renderer.clear();
	renderer.render(scene, camera);
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function initGUI() {

	controls = 	{	animeBGColor 	: false
				};

	gui.add( controls, 'animeBGColor').onChange(animeColors);
	gui.open();
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function animeColors(value) {

	if (value) 
		animeID = requestAnimationFrame(anime);
	else {
		cancelAnimationFrame(animeID);
		bgColor.r = 
		bgColor.g = 
		bgColor.b = 0.0;
		renderer.setClearColor(bgColor);

		renderer.clear();
		renderer.render(scene, camera);	

		oldTime = 0;
		}
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function anime() {

	const delta = clock.getDelta();
	let colorDiffR = bgNextColor.r - bgPreviousColor.r;
	let colorDiffG = bgNextColor.g - bgPreviousColor.g;
	let colorDiffB = bgNextColor.b - bgPreviousColor.b;

	oldTime += delta;

	if ( oldTime > 1.0 ) {
		bgPreviousColor.r = bgNextColor.r;
		bgPreviousColor.g = bgNextColor.g;
		bgPreviousColor.b = bgNextColor.b;
		bgNextColor.r = Math.random();
		bgNextColor.g = Math.random();
		bgNextColor.b = Math.random();
		
		renderer.setClearColor(bgColor);

		renderer.clear();
		renderer.render(scene, camera);	
		oldTime = 0;
	}else{
		bgColor.r = bgPreviousColor.r + (oldTime * colorDiffR);
		bgColor.g = bgPreviousColor.g + (oldTime * colorDiffG);
		bgColor.b = bgPreviousColor.b + (oldTime * colorDiffB);
		renderer.setClearColor(bgColor);
		renderer.clear();
		renderer.render(scene, camera);	
	}

	animeID = requestAnimationFrame(anime);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function onWindowResize() {

	let minDim = Math.min(window.innerWidth, window.innerHeight);

	renderer.setSize(minDim*0.8, minDim*0.8);

	renderer.clear();
	renderer.render(scene, camera);
}


// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //
main();
