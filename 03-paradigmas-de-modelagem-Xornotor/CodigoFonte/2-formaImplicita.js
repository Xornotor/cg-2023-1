// Criando uma imagem com Fragment Shader

import * as THREE from 'three';

import { GUI } from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js';

const 	gui = new GUI();

const 	rendSize 	= new THREE.Vector2();

const 	clock 		= new THREE.Clock();

var 	controls, 
		scene,
		camera,
		renderer,
		shaderMat;

const 	vel1Base	= new THREE.Vector2((Math.random() - 0.5) * 3.5, (Math.random() - 0.5) * 3.5);
const 	vel2Base	= new THREE.Vector2((Math.random() - 0.5) * 3.5, (Math.random() - 0.5) * 3.5);
const 	vel3Base	= new THREE.Vector2((Math.random() - 0.5) * 3.5, (Math.random() - 0.5) * 3.5);

var 	velBlob1	= vel1Base;
var 	velBlob2	= vel2Base
var 	velBlob3	= vel3Base;

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

	camera = new THREE.OrthographicCamera( -5.0, 5.0, 5.0, -5.0, -1.0, 1.0 );

	initGUI();

    geraImagem();

	renderer.clear();
	renderer.render(scene, camera);
	
	requestAnimationFrame(anime);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function geraImagem() {

	var blobVec = [];

	blobVec.push(new THREE.Vector2((Math.random() - 0.5) * 5.0, (Math.random() - 0.5) * 5.0));
	blobVec.push(new THREE.Vector2((Math.random() - 0.5) * 5.0, (Math.random() - 0.5) * 5.0));
	blobVec.push(new THREE.Vector2((Math.random() - 0.5) * 5.0, (Math.random() - 0.5) * 5.0));

	shaderMat = new THREE.ShaderMaterial( 	
					{ 	uniforms  		: 	{	uBlob  		: { value 	: blobVec},
												uImpFunc  	: { value 	: 0 } 
											},
						vertexShader 	: document.getElementById('vertShader').textContent,
						fragmentShader 	: document.getElementById('fragShader').textContent,
						wireframe  		: false,
					} );

	var plane 			= new THREE.Mesh( 	new THREE.PlaneGeometry(20.0, 20.0, 10, 10),
											shaderMat );
	plane.name = "blobs";
	scene.add( plane );	
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function initGUI() {

	controls = 	{ implFunc			: "invRaio",
				  multVelocidade	: 1.0};

	gui.add( controls, 'implFunc', ["invRaio", "Blob", "SoftObject", "Mix"]).onChange(mudaGUIValue);
	gui.add( controls, 'multVelocidade', 0.3, 5.0 ).onChange(mudaMultVel);

	gui.open();
};

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function mudaGUIValue() {

	var obj = scene.getObjectByName("blobs")

	switch (controls.implFunc) {
		case "invRaio" 		: 	obj.material.uniforms.uImpFunc.value = 0;
								break;

		case "Blob" 		: 	obj.material.uniforms.uImpFunc.value = 1;
								break;

		case "SoftObject" 	: 	obj.material.uniforms.uImpFunc.value = 2;
								break;

		case "Mix" 			: 	obj.material.uniforms.uImpFunc.value = 3;
								break;
		}

	obj.material.uniformsNeedUpdate = true;

	renderer.clear();
	renderer.render(scene, camera);    
};

// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //

function mudaMultVel(value){
	velBlob1	= new THREE.Vector2(vel1Base.x * value, vel1Base.y * value);
	velBlob2	= new THREE.Vector2(vel2Base.x * value, vel2Base.y * value);
	velBlob3	= new THREE.Vector2(vel3Base.x * value, vel3Base.y * value);

	renderer.clear();
	renderer.render(scene, camera);
}

// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //

function anime(time){
	const delta = clock.getDelta();

	var oldBlobVec = shaderMat.uniforms.uBlob.value;

	if(oldBlobVec[0].x >= 4.5 || oldBlobVec[0].x <= -4.5)
		velBlob1.x *= -1.0;
	if(oldBlobVec[0].y >= 4.5 || oldBlobVec[0].y <= -4.5)
		velBlob1.y *= -1.0;
	if(oldBlobVec[1].x >= 4.5 || oldBlobVec[1].x <= -4.5)
		velBlob2.x *= -1.0;
	if(oldBlobVec[1].y >= 4.5 || oldBlobVec[1].y <= -4.5)
		velBlob2.y *= -1.0;
	if(oldBlobVec[2].x >= 4.5 || oldBlobVec[2].x <= -4.5)
		velBlob3.x *= -1.0;
	if(oldBlobVec[2].y >= 4.5 || oldBlobVec[2].y <= -4.5)
		velBlob3.y *= -1.0;

	var newBlobVec = [];

	newBlobVec.push(new THREE.Vector2(oldBlobVec[0].x + (delta * velBlob1.x), oldBlobVec[0].y + (delta * velBlob1.y)));
	newBlobVec.push(new THREE.Vector2(oldBlobVec[1].x + (delta * velBlob2.x), oldBlobVec[1].y + (delta * velBlob2.y)));
	newBlobVec.push(new THREE.Vector2(oldBlobVec[2].x + (delta * velBlob3.x), oldBlobVec[2].y + (delta * velBlob3.y)));

	shaderMat.uniforms.uBlob.value = newBlobVec;
	shaderMat.uniforms.uBlob.needsUpdate = true;

	renderer.clear();
	renderer.render(scene, camera);

	requestAnimationFrame(anime);
}

// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //

main();
