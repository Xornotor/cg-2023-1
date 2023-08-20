// Desenhando objetos gráficos 3D do Three.JS

import * as THREE from 'three';

import { GUI } from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js';

const 	gui 		= new GUI();
const 	rendSize 	= new THREE.Vector2();

var 	controls, 
		scene,
		camera,
		renderer,
		curObj = null;

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

	var axis = new THREE.AxesHelper(0.8);
    axis.name = "eixos";
    scene.add(axis);


	var objMesh = new THREE.Mesh 	( 	new THREE.TetrahedronGeometry(), 
										new THREE.MeshBasicMaterial({color:0xff0000})
									); 
	objMesh.name 	= "Tetraedro";
	objMesh.visible = true;
	objMesh.rotateY(60.0 * Math.PI / 180.0); 
	objMesh.updateMatrix();
	scene.add( objMesh );

	curObj = objMesh;
	
	objMesh = new THREE.Mesh 	( 	new THREE.TorusGeometry(0.5, 0.3, 30, 30), 
									new THREE.MeshBasicMaterial({color:0xff0000})
								); 
	objMesh.name 	= "Toro";
	objMesh.visible = false;
	scene.add( objMesh );
	
	objMesh = new THREE.Mesh 	( 	new THREE.TorusKnotGeometry(0.5, 0.2), 
									new THREE.MeshBasicMaterial({color:0xff0000})
								); 
	objMesh.name 	= "TorusKnot";
	objMesh.visible = false;
	scene.add( objMesh );

	objMesh = new THREE.Mesh 	( 	new THREE.SphereGeometry( 0.5, 12, 29 ),
									new THREE.MeshBasicMaterial({color:0xff0000})
								); 
	objMesh.name 	= "Sphere";
	objMesh.visible = false;
	scene.add( objMesh );

	objMesh = new THREE.Mesh 	( 	new THREE.ConeGeometry( 0.6, 1.4, 36 ),
									new THREE.MeshBasicMaterial({color:0xff0000})
								); 
	objMesh.name 	= "Cone";
	objMesh.visible = false;
	scene.add( objMesh );

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function initGUI() {

	controls = 	{	Forma3D : "Tetraedro",
					Wireframe:	false,
					ColorPicker: { r: 1.0, g: 0.0, b: 0.0 },
					};

	gui.add( controls, 'Forma3D', [ 	"Tetraedro", 
										"Toro", 
										"TorusKnot",
										"Sphere",
										"Cone" ] ).onChange(changeObj);

	gui.add( controls, 'Wireframe').onChange(changeWireframe);
	gui.addColor( controls, 'ColorPicker').onChange(changeColor);
	gui.open();
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function changeObj(val) { 

	scene.children.forEach(function(mesh){
		if(mesh.name != "eixos"){
			if(mesh.name == val){
				mesh.visible = true;
			}else{
				mesh.visible = false;
			}
		}
	})

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //

function changeWireframe(val){
	if(val){
		scene.children.forEach(function(mesh){
			if(mesh.name != "eixos") mesh.material.wireframe = true;
		})
	}else{
		scene.children.forEach(function(mesh){
			if(mesh.name != "eixos") mesh.material.wireframe = false;
		})
	}

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //

function changeColor(newColor){
	scene.children.forEach(function(mesh){
		if(mesh.name != "eixos"){
			mesh.material.color.r = newColor.r;
			mesh.material.color.g = newColor.g;
			mesh.material.color.b = newColor.b;
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
