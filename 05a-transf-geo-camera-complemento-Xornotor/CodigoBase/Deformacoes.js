// Commposição de Transformações Geométricas.

import * as THREE from 'three';
import { GUI } 		from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js'

const 	rendSize 	= new THREE.Vector2();
var 	pos 		= 0.0;

var 	scene,
		renderer,
		camera,
		controls;

var gui = new GUI();

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	rendSize.x = 
	rendSize.y = Math.min(window.innerWidth, window.innerHeight) * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();

	camera = new THREE.OrthographicCamera( -5.0, 5.0, 5.0, -5.0, -5.0, 5.0 );
	//camera.rotation.copy(new THREE.Euler(0.0, Math.PI/2, 0.0));
	scene.add( camera );

	initGUI();

	buildScene();

	renderer.render(scene, camera);
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function initGUI() {

	controls = 	{	DeformFactor		: 0.5,
					DeformType			: 'Bending',
					};

	gui.add( controls, 'DeformFactor', -2.0, 2.0, 0.05).onChange(updateShaderUniform);
	gui.add( controls, 'DeformType', ['Twist',
									'Bending',
									'Tapering',
									]).onChange(updateShaderUniform);
	gui.open();
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function updateShaderUniform(val) {

	var obj = scene.getObjectByName("QuadVerm")
	obj.material.uniforms.uDefFactor.value = controls.DeformFactor;
	switch(controls.DeformType){
		case 'Twist':
			obj.material.uniforms.uDefType.value = 0;
			break;
		case 'Bending':
			obj.material.uniforms.uDefType.value = 1;
			break;
		case 'Tapering':
			obj.material.uniforms.uDefType.value = 2;
			break;
	}
	obj.material.uniformsNeedUpdate = true;

	renderer.clear();
	renderer.render(scene, camera);    
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function buildScene() {

	var axis = new THREE.AxesHelper(5.0);
	scene.add(axis);


	var shaderMat = 	new THREE.ShaderMaterial( 	
							{ 	uniforms  		: 	{	uDefFactor	: { type 	: "f" , 
																		value  	: 0.5 },
														uDefType	: { type 	: "i" , 
																		value  	: 1 },
													},
								vertexShader 	: document.getElementById('PerspVS').textContent,
								fragmentShader 	: document.getElementById('PerspFS').textContent,
								wireframe  		: false,
							} );

	var quad1 	= new THREE.Mesh 	( 	new THREE.BoxGeometry( 1.0, 2.0, 1.0, 100, 100, 100 ), 
										shaderMat, 
									);
	quad1.name = "QuadVerm";
	quad1.scale.x = 
	quad1.scale.y = 2.0;
	quad1.position.x = 0.0;
	quad1.position.y = 0.0;
	
	scene.add(quad1);
};

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
