// Criando uma imagem com Fragment Shader

import * as THREE from 'three';

import { GUI } from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js';

const 	gui = new GUI();

const 	clock 				= new THREE.Clock();

const 	rendSize 			= new THREE.Vector2();

var 	controls, 
		scene,
		camera,
		renderer,
		shaderMat,
		animeID;

var 	oldTime				= 0;

var  	bgColor 			= new THREE.Color(0x0000FF);
var		bgPreviousColor		= new THREE.Color(0x0000FF);
var		bgNextColor 		= new THREE.Color(0x00FF00);
var  	objColor 			= new THREE.Color(0xFF0000);

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	let minDim = Math.min(window.innerWidth, window.innerHeight);

	renderer.setSize(minDim*0.8, minDim*0.8);

	document.body.appendChild(renderer.domElement);

	window.addEventListener ( 'resize', onWindowResize 	);

	scene 	= new THREE.Scene();

	camera = new THREE.OrthographicCamera( -10.0, 10.0, 10.0, -10.0, -1.0, 1.0 );

	initGUI();

    geraImagem();

	anime();

	renderer.clear();
	renderer.render(scene, camera);    
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function geraImagem() {

	shaderMat = new THREE.ShaderMaterial( 	
					{ 	uniforms  		: 	{	uRaio  				: { type 	: "f" , 
																		value  	: 5.0 }, 
												uFogMultiplier  	: { type 	: "f" , 
																		value  	: 0.3 }, 
												uDist				: {	type	: "i" ,
																		value	: 0},
												uBgColor			: { type	: "vec3",
																		value	: bgColor},
												uObjColor			: { type	: "vec3",
																		value	: objColor},
											},
						vertexShader 	: document.getElementById('vertShader').textContent,
						fragmentShader 	: document.getElementById('fragShader').textContent,
						wireframe  		: false,
					} );

	var plane 			= new THREE.Mesh( 	new THREE.PlaneGeometry(20.0, 20.0, 10, 10),
											shaderMat );
	plane.name = "imagem";
	scene.add( plane );	
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function initGUI() {

	controls = 	{	Raio 		: 5.0,
					Fog			: 0.3,
					Distancia	: "Euclidiana",
				};

	gui.add( controls, 'Raio', 1.0, 10.0).onChange(mudaRaio);
	gui.add( controls, 'Fog', 0.0, 1.0).onChange(mudaFog);
	gui.add( controls, 'Distancia', [	'Euclidiana',
										'Manhattan',
										'Chebyshev'
									]).onChange(mudaDistancia);

	gui.open();
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function mudaRaio() {

	var obj = scene.getObjectByName("imagem")
	obj.material.uniforms.uRaio.value = controls.Raio;
	obj.material.uniformsNeedUpdate = true;

	renderer.clear();
	renderer.render(scene, camera);    
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function mudaFog() {

	var obj = scene.getObjectByName("imagem")
	obj.material.uniforms.uFogMultiplier.value = controls.Fog;
	obj.material.uniformsNeedUpdate = true;

	renderer.clear();
	renderer.render(scene, camera);    
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function mudaDistancia(value) {

	var obj = scene.getObjectByName("imagem");
	switch (value){
		case "Euclidiana"	:	obj.material.uniforms.uDist.value = 0;
								break;
		case "Manhattan"	:	obj.material.uniforms.uDist.value = 1;
								break;
		case "Chebyshev"	:	obj.material.uniforms.uDist.value = 2;
								break;
	}
	obj.material.uniformsNeedUpdate = true;

	renderer.clear();
	renderer.render(scene, camera);    
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function anime() {

	let obj = scene.getObjectByName("imagem");

	const delta = clock.getDelta();
	let bgColorDiffR = bgNextColor.r - bgPreviousColor.r;
	let bgColorDiffG = bgNextColor.g - bgPreviousColor.g;
	let bgColorDiffB = bgNextColor.b - bgPreviousColor.b;

	oldTime += delta;

	if ( oldTime > 1.0 ) {
		bgPreviousColor.r = bgNextColor.r;
		bgPreviousColor.g = bgNextColor.g;
		bgPreviousColor.b = bgNextColor.b;
		bgNextColor.r = Math.random();
		bgNextColor.g = Math.random();
		bgNextColor.b = Math.random();	
		oldTime = 0;
	}else{
		bgColor.r = bgPreviousColor.r + (oldTime * bgColorDiffR);
		bgColor.g = bgPreviousColor.g + (oldTime * bgColorDiffG);
		bgColor.b = bgPreviousColor.b + (oldTime * bgColorDiffB);
		objColor.r = 1.0 - bgColor.r;
		objColor.g = 1.0 - bgColor.g;
		objColor.b = 1.0 - bgColor.b;
	}

	obj.material.uniforms.uBgColor.value = bgColor;
	obj.material.uniforms.uObjColor.value = objColor;
	obj.material.uniformsNeedUpdate = true;

	renderer.clear();
	renderer.render(scene, camera); 

	animeID = requestAnimationFrame(anime);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function onWindowResize() {

	rendSize.x = window.innerWidth * 0.8;
	rendSize.y = window.innerHeight * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	camera.aspect = rendSize.x / rendSize.y;
	camera.updateProjectionMatrix();

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //

main();
