// Modificando a geometria do terreno utilizando Vertex Shader

import * as THREE from 'three';

import { GUI } from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js';

const 	gui = new GUI();

const 	rendSize 	= new THREE.Vector2();

var 	controls, 
		scene,
		camera,
		renderer,
		shaderMat;

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	rendSize.x = window.innerWidth * 0.8;
	rendSize.y = window.innerHeight * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 70.0, rendSize.x / rendSize.y, 0.01, 1000.0 );
	camera.position.y = 2.0;
	camera.position.z = 13.0;
	camera.updateProjectionMatrix();

	initGUI();

    geraTerreno();

    requestAnimationFrame(anime);

}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function geraTerreno() {

	shaderMat = new THREE.ShaderMaterial( 	
					{ 	uniforms  		: 	{	uAmp  			: { type 	: "f" , 
																	value  	: 2.0 },
												uPhase  		: { type 	: "f" , 
																	value  	: 0.0 },
												uEscalaSeno		: { type 	: "f" , 
																	value  	: 0.2 },
												uEscalaCosseno	: { type 	: "f" , 
																	value  	: 0.5 }
											},
						vertexShader 	: document.getElementById('minVertShader').textContent,
						fragmentShader 	: document.getElementById('minFragShader').textContent,
						wireframe  		: true,
						side 			: THREE.DoubleSide
					} );


    const terreno	= new THREE.Mesh 	(	new THREE.PlaneGeometry( 100, 100, 30, 30 ), 
    										shaderMat
										); 
	terreno.rotateX(-90.0 * Math.PI / 180.0);
    terreno.name 	= "terreno";
	scene.add( terreno );

	var axis = new THREE.AxesHelper(8.0);
    axis.name = "eixos";
	axis.position.y = 0.2;
	axis.updateMatrix();
    terreno.add(axis);

	requestAnimationFrame(anime);

}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function initGUI() {

	controls = 	{	Amplitude 		: 1.0,
					Fase			: 0.0,
					EscalaSeno		: 0.2,
					EscalaCosseno	: 0.5,
				};

	gui.add( controls, 'Amplitude', 0.1, 20.0).onChange(mudaAmp);
	gui.add( controls, 'Fase', 0, 6.28).onChange(mudaFase);
	gui.add( controls, 'EscalaSeno', 0, 5).onChange(mudaEscalaSeno);
	gui.add( controls, 'EscalaCosseno', 0, 5).onChange(mudaEscalaCosseno);

	gui.open();
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************
function anime(time) {

	var obj = scene.getObjectByName("terreno");

	obj.rotateZ(0.001);
	obj.updateMatrix();

	renderer.clear();
	renderer.render(scene, camera);

	requestAnimationFrame(anime);		
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //

function mudaAmp() {

	var obj = scene.getObjectByName("terreno");
	obj.material.uniforms.uAmp.value = controls.Amplitude;
	obj.material.uniformsNeedUpdate = true;
};

// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //

function mudaFase() {

	var obj = scene.getObjectByName("terreno");
	obj.material.uniforms.uPhase.value = controls.Fase;
	obj.material.uniformsNeedUpdate = true;
};


// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //

function mudaEscalaSeno() {

	var obj = scene.getObjectByName("terreno");
	obj.material.uniforms.uEscalaSeno.value = controls.EscalaSeno;
	obj.material.uniformsNeedUpdate = true;
};


// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //

function mudaEscalaCosseno() {

	var obj = scene.getObjectByName("terreno");
	obj.material.uniforms.uEscalaCosseno.value = controls.EscalaCosseno;
	obj.material.uniformsNeedUpdate = true;
};


// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //

main();
