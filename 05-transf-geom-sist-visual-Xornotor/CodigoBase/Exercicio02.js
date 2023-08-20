// Instancias de objetos.

import * as THREE from 'three';
import { GUI } 		from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js'

const 	rendSize 	= new THREE.Vector2();

var 	gui 		= new GUI();

var 	scene,
		renderer,
		camera,
		controls;

var		angleRotLua = 0.0,
		angleRotTerra = 0.0,
		angleTransLua = 0.0,
		angleTransTerra = 0.0;

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

	camera = new THREE.OrthographicCamera( -12.0, 12.0, 12.0, -12.0, -12.0, 12.0 );
	scene.add( camera );

	initGUI();

	buildScene();

	renderer.clear();
	requestAnimationFrame(animate);
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function initGUI() {

	controls = 	{	RotLua 		: true,
					RotTerra 	: true,
					RotTerraLua : true,
					RotSol		: true,
					};

	gui.add( controls, 'RotLua');
	gui.add( controls, 'RotTerra');
	gui.add( controls, 'RotTerraLua');
	gui.add( controls, 'RotSol');
	gui.open();
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function buildScene() {

	// Sistema Solar: Sol, Terra e Lua
	// 3 instancias de esferas 

	var sistemaSolar 		= new THREE.InstancedMesh( 	new THREE.SphereGeometry( 1.0, 10, 10), 
														new THREE.MeshBasicMaterial( {wireframe:true} ), 
														3 );
	sistemaSolar.name = "SistemaSolar";

	var axes = new THREE.AxesHelper(5);

	scene.add(sistemaSolar);

	const instanceColors 	= [ 0xffff00, 0x0000FF, 0xaaaaaa ];

	for (let i = 0 ; i < 3 ; i++) 
		sistemaSolar.setColorAt ( i, new THREE.Color(instanceColors[i]));
	
	// Sol
	var transfMat = new THREE.Matrix4().makeScale(4.0, 4.0, 4.0);
	sistemaSolar.setMatrixAt( 0, transfMat );

	// Terra
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeScale(1.0, 1.0, 1.0));
	transfMat.multiply(new THREE.Matrix4().makeTranslation(7.0, 0.0, 0.0));
	sistemaSolar.setMatrixAt( 1, transfMat );

	// Lua
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeScale(0.5, 0.5, 0.5));
	transfMat.multiply(new THREE.Matrix4().makeTranslation(18.0, 0.0, 0.0));
	sistemaSolar.setMatrixAt( 2, transfMat );

	sistemaSolar.needsUpdate = true;
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function animate(time) {

	let rotTerraLua	= 0.005;	// Rotação da Lua ao redor da Terra
	let rotTerra 	= 0.01;		// Rotação da Terra ao redor de seu eixo (Y)
	let rotLua 		= 0.005;	// Rotação da Lua ao redor do seu eixo (Y)
	let rotSol		= 0.005;	//Rotação da Lua e da Terra ao redor do Sol

	var obj = scene.getObjectByName("SistemaSolar");

	var transfMat = new THREE.Matrix4();

	// Terra
	if (controls.RotTerra && !controls.RotTerraLua && !controls.RotSol) {

		obj.getMatrixAt(1, transfMat);
		transfMat.multiply(new THREE.Matrix4().makeRotationY(rotTerra));
		obj.setMatrixAt(1, transfMat);

		angleRotTerra += rotTerra;
		
		}
		
	// Lua
	if (controls.RotLua && !controls.RotTerraLua && !controls.RotSol) {

		obj.getMatrixAt(2, transfMat);
		transfMat.multiply(new THREE.Matrix4().makeRotationX(rotLua));
		obj.setMatrixAt(2, transfMat);

		angleRotLua += rotLua;
		
		}

	// Lua e Terra ao redor do Sol		
	if (controls.RotSol && !controls.RotTerraLua) {

		obj.getMatrixAt(1, transfMat);
		transfMat.multiply(new THREE.Matrix4().makeRotationY(-angleRotTerra));
		transfMat.multiply(new THREE.Matrix4().makeRotationZ(-angleTransTerra));
		transfMat.multiply(new THREE.Matrix4().makeTranslation(-7*Math.cos(angleTransTerra),-7*Math.sin(angleTransTerra),0));
		if(controls.RotSol)
			transfMat.multiply(new THREE.Matrix4().makeRotationZ(angleTransTerra+rotSol));
		else
			transfMat.multiply(new THREE.Matrix4().makeRotationZ(angleTransTerra));
		transfMat.multiply(new THREE.Matrix4().makeTranslation(7, 0, 0));
		if(controls.RotTerra)
			transfMat.multiply(new THREE.Matrix4().makeRotationY(angleRotTerra+rotTerra));
		else
			transfMat.multiply(new THREE.Matrix4().makeRotationY(angleRotTerra));
		obj.setMatrixAt(1, transfMat);
		

		obj.getMatrixAt(2, transfMat);
		transfMat.multiply(new THREE.Matrix4().makeRotationX(-angleRotLua));
		transfMat.multiply(new THREE.Matrix4().makeRotationZ(-angleTransLua));
		transfMat.multiply(new THREE.Matrix4().makeTranslation(-4*Math.cos(angleTransLua),-4*Math.sin(angleTransLua),0));
		transfMat.multiply(new THREE.Matrix4().makeRotationZ(-angleTransTerra))
		transfMat.multiply(new THREE.Matrix4().makeScale(2, 2, 2));
		transfMat.multiply(new THREE.Matrix4().makeTranslation(-7*Math.cos(angleTransTerra),-7*Math.sin(angleTransTerra),0));
		if(controls.RotSol)
			transfMat.multiply(new THREE.Matrix4().makeRotationZ(angleTransTerra+rotSol));
		else
			transfMat.multiply(new THREE.Matrix4().makeRotationZ(angleTransTerra));
		transfMat.multiply(new THREE.Matrix4().makeTranslation(7, 0 ,0));
		transfMat.multiply(new THREE.Matrix4().makeScale(0.5, 0.5, 0.5));
		transfMat.multiply(new THREE.Matrix4().makeRotationZ(angleTransLua));
		transfMat.multiply(new THREE.Matrix4().makeTranslation(4, 0, 0));
		if(controls.RotLua)
			transfMat.multiply(new THREE.Matrix4().makeRotationX(angleRotLua+rotLua));
		else
			transfMat.multiply(new THREE.Matrix4().makeRotationX(angleRotLua));
		obj.setMatrixAt(2, transfMat);

		angleTransTerra += rotSol;

		if(controls.RotTerra)
			angleRotTerra += rotTerra;

		if(controls.RotLua)
			angleRotLua += rotLua;

		}

	// Lua ao redor da Terra
	if (controls.RotTerraLua) {
		
		obj.getMatrixAt(1, transfMat);
		transfMat.multiply(new THREE.Matrix4().makeRotationY(-angleRotTerra));
		transfMat.multiply(new THREE.Matrix4().makeRotationZ(-angleTransTerra));
		transfMat.multiply(new THREE.Matrix4().makeTranslation(-7*Math.cos(angleTransTerra),-7*Math.sin(angleTransTerra),0));
		if(controls.RotSol)
			transfMat.multiply(new THREE.Matrix4().makeRotationZ(angleTransTerra+rotSol));
		else
			transfMat.multiply(new THREE.Matrix4().makeRotationZ(angleTransTerra));
		transfMat.multiply(new THREE.Matrix4().makeTranslation(7, 0, 0));
		if(controls.RotTerra)
			transfMat.multiply(new THREE.Matrix4().makeRotationY(angleRotTerra+rotTerra));
		else
			transfMat.multiply(new THREE.Matrix4().makeRotationY(angleRotTerra));
		obj.setMatrixAt(1, transfMat);
		

		obj.getMatrixAt(2, transfMat);
		transfMat.multiply(new THREE.Matrix4().makeRotationX(-angleRotLua));
		transfMat.multiply(new THREE.Matrix4().makeRotationZ(-angleTransLua));
		transfMat.multiply(new THREE.Matrix4().makeTranslation(-4*Math.cos(angleTransLua),-4*Math.sin(angleTransLua),0));
		transfMat.multiply(new THREE.Matrix4().makeRotationZ(-angleTransTerra))
		transfMat.multiply(new THREE.Matrix4().makeScale(2, 2, 2));
		transfMat.multiply(new THREE.Matrix4().makeTranslation(-7*Math.cos(angleTransTerra),-7*Math.sin(angleTransTerra),0));
		if(controls.RotSol)
			transfMat.multiply(new THREE.Matrix4().makeRotationZ(angleTransTerra+rotSol));
		else
			transfMat.multiply(new THREE.Matrix4().makeRotationZ(angleTransTerra));
		transfMat.multiply(new THREE.Matrix4().makeTranslation(7, 0 ,0));
		transfMat.multiply(new THREE.Matrix4().makeScale(0.5, 0.5, 0.5));
		transfMat.multiply(new THREE.Matrix4().makeRotationZ(angleTransLua+rotTerraLua));
		transfMat.multiply(new THREE.Matrix4().makeTranslation(4, 0, 0));
		if(controls.RotLua)
			transfMat.multiply(new THREE.Matrix4().makeRotationX(angleRotLua+rotLua));
		else
			transfMat.multiply(new THREE.Matrix4().makeRotationX(angleRotLua));
		obj.setMatrixAt(2, transfMat);

		angleTransLua += rotTerraLua;

		if(controls.RotTerra)
			angleRotTerra += rotTerra;

		if(controls.RotLua)
			angleRotLua += rotLua;

		if(controls.RotSol)
			angleTransTerra += rotSol;
	}

	obj.instanceMatrix.needsUpdate = true;

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
