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

	const vertices = [];

	vertices.push(	new THREE.Vector3( -0.5, -0.5, 0.0 ) );
	vertices.push(	new THREE.Vector3(  0.5, -0.5, 0.0 ) );
	vertices.push(	new THREE.Vector3(  0.5,  0.5, 0.0 ) );
	vertices.push(	new THREE.Vector3( -0.5,  0.5, 0.0 ) );

	var geometry = new THREE.BufferGeometry().setFromPoints( vertices );

	const material = new THREE.LineDashedMaterial( {
		color: 0x4FD28A,
		linewidth: 3,
		scale: 1,
		dashSize: 3,
		gapSize: 1,
	} );
	
	var lineStrip = new THREE.Line( geometry, material );
	lineStrip.name = "linhaAberta";
	scene.add( lineStrip );	

	var lineLoop = new THREE.LineLoop( geometry, material );
	lineLoop.name = "linhaFechada";
	lineLoop.visible = false;
	scene.add( lineLoop );	

	var lineSeg = new THREE.LineSegments( geometry, material );
	lineSeg.name = "linhaSegments";
	lineSeg.visible = false;
	scene.add( lineSeg );	

	const curve = new THREE.SplineCurve( [
		new THREE.Vector2( -0.5, 0.0 ),
		new THREE.Vector2( 0.2, 0.6 ),
		new THREE.Vector2( 0.5, 0.0 )
	] );
	var curvePoints = curve.getPoints(50);
	var geometryCurve = new THREE.BufferGeometry().setFromPoints(curvePoints);
	var lineCurve = new THREE.Line( geometryCurve, material );
	lineCurve.name = "linhaSpline";
	lineCurve.visible = false;
	scene.add( lineCurve );

	renderer.clear();
	renderer.render(scene, camera);
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function initGUI() {

	var controls = 	{	Primitiva : "Line"
				};

	gui.add( controls, 'Primitiva', [ 	"Line", 
										"LineLoop", 
										"LineSegments",
										"SplineCurve" ] ).onChange(changeLine);
	gui.open();
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function changeLine(value) {

	switch (value) {
		case "Line" :			scene.getObjectByName("linhaAberta").visible	= true;
								scene.getObjectByName("linhaFechada").visible	= false;
								scene.getObjectByName("linhaSegments").visible	= false;
								scene.getObjectByName("linhaSpline").visible		= false;
								break;
		case "LineLoop"	:	  	scene.getObjectByName("linhaAberta").visible	= false;
								scene.getObjectByName("linhaFechada").visible	= true;
								scene.getObjectByName("linhaSegments").visible	= false;
								scene.getObjectByName("linhaSpline").visible		= false;
								break;
		case "LineSegments" :  	scene.getObjectByName("linhaAberta").visible	= false;
								scene.getObjectByName("linhaFechada").visible	= false;
								scene.getObjectByName("linhaSegments").visible	= true;
								scene.getObjectByName("linhaSpline").visible		= false;
								break;
		case "SplineCurve" :  	scene.getObjectByName("linhaAberta").visible	= false;
								scene.getObjectByName("linhaFechada").visible	= false;
								scene.getObjectByName("linhaSegments").visible	= false;
								scene.getObjectByName("linhaSpline").visible		= true;
								break;
		}

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
