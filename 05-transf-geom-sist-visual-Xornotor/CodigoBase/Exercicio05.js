// Construindo um sistema planetário.

import * as THREE from 'three';
import { GUI } 		from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js'

const 	rendSize 	= new THREE.Vector2();

var 	gui 		= new GUI();

var 	scene,
		renderer,
		camera,
		cameraOrto,
		cameraHelper,
		controls;

var		angleStationaryCam = -1.2,
		angleRevolutionCam = 0.0;

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

	camera = new THREE.OrthographicCamera( -5.0, 5.0, 5.0, -5.0, 0.0, 40.0);
	camera.position.y = 12.0;
	camera.rotation.copy(new THREE.Euler( Math.PI/2, 0.0, 0.0 ));
	scene.add( camera );

	cameraHelper = new THREE.CameraHelper(camera);
	scene.add( cameraHelper );

	cameraOrto = new THREE.OrthographicCamera(-60.0, 60.0, 60.0, -60.0, -50.0, 50.0);
	cameraOrto.position.x	= 0.0;
	cameraOrto.position.y	= 0.0;
	cameraOrto.position.z	= 0.0;
	cameraOrto.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
	scene.add( cameraOrto );

	initGUI();

	buildScene();
		
	renderer.clear();

	if(controls.CameraHelper){
		cameraHelper.visible = true;
		cameraHelper.update();
		renderer.render(scene, cameraOrto);
	}else{
		cameraHelper.visible = false;
		cameraHelper.update();
		renderer.render(scene, camera);
	}
	requestAnimationFrame(animate);
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function initGUI() {

	controls = 	{	RotLua 					: true,
					RotTerra 				: true,
					RotTerraLua 			: true,
					RotSol					: true,
					CameraHelper			: false,
					Camera					: 'Estacionaria',
					};

	gui.add( controls, 'RotLua');
	gui.add( controls, 'RotTerra');
	gui.add( controls, 'RotTerraLua');
	gui.add( controls, 'RotSol');
	gui.add( controls, 'CameraHelper')
	gui.add( controls, 'Camera', ['Estacionaria', 'Revolucao']);
	gui.open();
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function buildScene() {

	// Sistema Solar

	// Eixo do Sol
	var sAxis = new THREE.AxesHelper(4.8);

	// Sol
	var sol = new THREE.Mesh 	( 	new THREE.SphereGeometry( 4.0, 20, 20), 
									new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe:false} ) 
								);
	sol.name = "Sol";
	sol.add(sAxis);
	scene.add(sol);	

	//Grupo Terra-Lua
	var terraLua = new THREE.Object3D();
	terraLua.name = "ObjTerraLua";

	// Eixo da Terra
	var tAxis = new THREE.AxesHelper(1.2);

	// Terra
	var terra = new THREE.Mesh 	( 	new THREE.SphereGeometry( 1.0, 10, 10), 
									new THREE.MeshBasicMaterial( {color: 0x0000ff, wireframe:false} ) 
								);
	terra.name = "Terra";
	terra.position.set(0.0, 0.0, 0.0);
	terra.add(tAxis);
	terraLua.add(terra);	

	// Eixo da Lua
	var lAxis = new THREE.AxesHelper(0.6);

	// Lua
	var lua = new THREE.Mesh 	( 	new THREE.SphereGeometry( 0.5, 10, 10 ), 
									new THREE.MeshBasicMaterial( {color: 0xaaaaaa, wireframe:false} ) 
								);
	lua.name = "Lua";	
	lua.add(lAxis);

	var luaRotTerra = new THREE.Object3D();
	lua.position.set(0.0, 2.3, 0.0);
	luaRotTerra.add(lua);
	luaRotTerra.name = "LuaRotTerra";

	terraLua.add(luaRotTerra);
	terraLua.position.set(25, 0.0, 0.0);

	var terraLuaWorld = new THREE.Object3D();
	terraLuaWorld.name = "TerraLuaRotSol";
	terraLuaWorld.add(terraLua);

	scene.add(terraLuaWorld);
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function animate() {

	let rotTerraLua	= 0.005;	// Rotação da Lua ao redor da Terra
	let rotTerra 	= 0.09;		// Rotação da Terra ao redor de seu eixo (Y)
	let rotLua 		= 0.01;		// Rotação da Lua ao redor do seu eixo (Y)
	let rotSol		= 0.008;	// Rotação da Terra-Lua ao redor do sol
	let rotCamera	= 0.006;
	let revoCamera	= 0.021;

	var obj;

	if (controls.RotTerra) {
		obj = scene.getObjectByName("Terra");

		obj.rotateY(rotTerra);
		
		obj.updateMatrix();
		}

	if (controls.RotLua) {
		obj = scene.getObjectByName("Lua");

		obj.rotateY(rotLua);
		
		obj.updateMatrix();
		}


	if (controls.RotTerraLua) {

		obj = scene.getObjectByName("LuaRotTerra");

		obj.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), rotTerraLua);
		
		obj.updateMatrix();
		
		}	

	if (controls.RotSol) {
		obj = scene.getObjectByName("TerraLuaRotSol");

		obj.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), rotSol);
		
		obj.updateMatrix();
	}

		camera.position.y = 12.0 * Math.cos(-angleStationaryCam);
		camera.position.x = 12.0 * Math.sin(-angleStationaryCam);
		camera.rotation.copy(new THREE.Euler( Math.PI/2, angleStationaryCam, 0.0 ));
		angleStationaryCam += rotCamera;
	if (controls.Camera == 'Revolucao') {
		camera.rotation.copy(new THREE.Euler( Math.PI/2, angleRevolutionCam, 0.0 ));
		angleRevolutionCam += revoCamera;
	}

	
	if(controls.CameraHelper){
		cameraHelper.visible = true;
		cameraHelper.update();
		renderer.render(scene, cameraOrto);
	}else{
		cameraHelper.visible = false;
		cameraHelper.update();
		renderer.render(scene, camera);
	}
	requestAnimationFrame(animate);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
