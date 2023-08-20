// Construindo um sistema planetário.

import * as THREE from 'three';
import { GUI } 		from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js'

const 	rendSize 	= new THREE.Vector2();

var 	scene,
		renderer,
		cameraTop,
		cameraSide,
		cameraFront,
		cameraSatellite,
		controls;
		
var		angleStationaryCam = -1.2,
		angleRevolutionCam = 0.0;

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	
	renderer.autoClear = false;

	rendSize.x = 
	rendSize.y = Math.min(window.innerWidth, window.innerHeight) * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();

	
	cameraTop = new THREE.OrthographicCamera(-30.0, 30.0, 30.0, -30.0, -50.0, 50.0);
	scene.add( cameraTop );
	
	cameraFront = new THREE.OrthographicCamera(-30.0, 30.0, 30.0, -30.0, -50.0, 50.0);
	cameraFront.rotation.copy(new THREE.Euler( Math.PI/2, 0.0, 0.0 ));
	scene.add( cameraFront );
	
	cameraSide = new THREE.OrthographicCamera(-30.0, 30.0, 30.0, -30.0, -50.0, 50.0);
	cameraSide.rotation.copy(new THREE.Euler( 0.0, Math.PI/2, 0.0 ));
	scene.add( cameraSide );
	
	cameraSatellite = new THREE.OrthographicCamera( -5.0, 5.0, 5.0, -5.0, 0.0, 40.0);
	cameraSatellite.position.y = 12.0;
	cameraSatellite.rotation.copy(new THREE.Euler( Math.PI/2, 0.0, 0.0 ));
	scene.add( cameraSatellite );

	buildScene();
		
	render();
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

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

function render() {

	renderer.clear(true, true);

	renderer.setViewport(0.0, 0.0, rendSize.x / 2.0, rendSize.y / 2.0 );
	cameraTop.updateProjectionMatrix();
	renderer.render( scene, cameraTop );
		
	renderer.setViewport(rendSize.x / 2.0, 0.0, rendSize.x / 2.0, rendSize.y / 2.0 );
	cameraFront.updateProjectionMatrix();
	renderer.render( scene, cameraFront );
	
	renderer.setViewport(rendSize.x / 2.0, rendSize.y / 2.0, rendSize.x / 2.0, rendSize.y / 2.0 );
	cameraSide.updateProjectionMatrix();
	renderer.render( scene, cameraSide );
	
	renderer.setViewport(0.0, rendSize.y / 2.0, rendSize.x / 2.0, rendSize.y / 2.0 );
	cameraSatellite.updateProjectionMatrix();
	renderer.render( scene, cameraSatellite );
		
	requestAnimationFrame(animate);
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function animate() {

	let rotTerraLua	= 0.005;	// Rotação da Lua ao redor da Terra
	let rotTerra 	= 0.09;		// Rotação da Terra ao redor de seu eixo (Y)
	let rotLua 		= 0.01;		// Rotação da Lua ao redor do seu eixo (Y)
	let rotSol		= 0.003;	// Rotação da Terra-Lua ao redor do sol
	let rotCamera	= 0.006;
	let revoCamera	= 0.021;

	var obj;
	
	cameraSatellite.position.y = 12.0 * Math.cos(-angleStationaryCam);
	cameraSatellite.position.x = 12.0 * Math.sin(-angleStationaryCam);
	cameraSatellite.rotation.copy(new THREE.Euler( Math.PI/2, angleStationaryCam, 0.0 ));
	angleStationaryCam += rotCamera;
	cameraSatellite.rotation.copy(new THREE.Euler( Math.PI/2, angleRevolutionCam, 0.0 ));
	angleRevolutionCam += revoCamera;

	obj = scene.getObjectByName("Terra");
	obj.rotateY(rotTerra);
	obj.updateMatrix();

	obj = scene.getObjectByName("Lua");
	obj.rotateY(rotLua);
	obj.updateMatrix();

	obj = scene.getObjectByName("LuaRotTerra");
	obj.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), rotTerraLua);
	obj.updateMatrix();
	
	obj = scene.getObjectByName("TerraLuaRotSol");
	obj.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), rotTerraLua);
	obj.updateMatrix();

	render();
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
