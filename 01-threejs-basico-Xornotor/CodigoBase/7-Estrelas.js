// Desenhando objetos gráficos 2D

import * as THREE from 'three';

import { GUI } from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js';

const 	gui 		= new GUI();
const 	rendSize 	= new THREE.Vector2();

var 	controls, 
		scene,
		camera,
		renderer;

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	rendSize.x = 
	rendSize.y = Math.min(window.innerWidth, window.innerHeight) * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	window.addEventListener ( 'resize', onWindowResize 	);

	scene 	= new THREE.Scene();

	initGUI();

	camera = new THREE.OrthographicCamera( -1.0, 1.0, 1.0, -1.0, -1.0, 1.0 );

	/* Vértices */

	var pontosEstrela1 = [];
	var pontosEstrela2 = [];
	var pontosEstrela3 = [];

	for(var i = 0; i < 4; i++){
		var outerX = 0.65 * Math.cos(i*Math.PI/2);
		var outerY = 0.65 * Math.sin(i*Math.PI/2);
		var innerX = 0.15 * Math.cos((i*Math.PI/2) + Math.PI/4);
		var innerY = 0.15 * Math.sin((i*Math.PI/2) + Math.PI/4);
		pontosEstrela1.push(new THREE.Vector3( outerX, outerY, 0.0 ) );
		pontosEstrela1.push(new THREE.Vector3( innerX, innerY, 0.0 ) );
	}

	for(var i = 0; i < 10; i++){
		var outerX = 0.65 * Math.cos(i*Math.PI/5 - Math.PI/10);
		var outerY = 0.65 * Math.sin(i*Math.PI/5 - Math.PI/10);
		var innerX = 0.53 * Math.cos((i*Math.PI/5));
		var innerY = 0.53 * Math.sin((i*Math.PI/5));
		pontosEstrela2.push(new THREE.Vector3( outerX, outerY, 0.0 ) );
		pontosEstrela2.push(new THREE.Vector3( innerX, innerY, 0.0 ) );
	}

	for(var i = 0; i < 5; i++){
		var outerMajorX = 0.65 * Math.cos(i*Math.PI/2.5 + Math.PI/2);
		var outerMajorY = 0.65 * Math.sin(i*Math.PI/2.5 + Math.PI/2);
		var innerMajorX = 0.25 * Math.cos(i*Math.PI/2.5 + Math.PI/2 + 1.3*Math.PI/10);
		var innerMajorY = 0.25 * Math.sin(i*Math.PI/2.5 + Math.PI/2 + 1.3*Math.PI/10);
		var outerMinorX = 0.35 * Math.cos(i*Math.PI/2.5 + Math.PI/2 + Math.PI/5);
		var outerMinorY = 0.35 * Math.sin(i*Math.PI/2.5 + Math.PI/2 + Math.PI/5);
		var innerMinorX = 0.25 * Math.cos(i*Math.PI/2.5 + Math.PI/2 + 2.7*Math.PI/10);
		var innerMinorY = 0.25 * Math.sin(i*Math.PI/2.5 + Math.PI/2+  2.7*Math.PI/10);
		pontosEstrela3.push(new THREE.Vector3( outerMajorX, outerMajorY, 0.0 ) );
		pontosEstrela3.push(new THREE.Vector3( innerMajorX, innerMajorY, 0.0 ) );
		pontosEstrela3.push(new THREE.Vector3( outerMinorX, outerMinorY, 0.0 ) );
		pontosEstrela3.push(new THREE.Vector3( innerMinorX, innerMinorY, 0.0 ) );
	}
	
	/* Geometrias */

	var geometry1 = new THREE.BufferGeometry().setFromPoints( pontosEstrela1 );
	var geometry2 = new THREE.BufferGeometry().setFromPoints( pontosEstrela2 );
	var geometry3 = new THREE.BufferGeometry().setFromPoints( pontosEstrela3 );

	/* Estrelas */

	var estrela = new THREE.LineLoop( geometry1 );
	estrela.name = "Estrela1";
	scene.add( estrela );	

	estrela = new THREE.LineLoop( geometry2 );
	estrela.name = "Estrela2";
	estrela.visible = false;
	scene.add( estrela );	

	estrela = new THREE.LineLoop( geometry3 );
	estrela.name = "Estrela3";
	estrela.visible = false;
	scene.add( estrela );	

	renderer.clear();
	renderer.render(scene, camera);
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function initGUI() {

	controls = 	{	Estrela : "Estrela1"
				};

	gui.add( controls, 'Estrela', [ 	"Estrela1", 
										"Estrela2", 
										"Estrela3"] ).onChange(changeStar);
	gui.open();
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function changeStar(value) {

	scene.children.forEach(function(mesh){
		if(mesh.name == value){
			mesh.visible = true;
		}else{
			mesh.visible = false;
		}
	})

	renderer.clear();
	renderer.render(scene, camera);	
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
