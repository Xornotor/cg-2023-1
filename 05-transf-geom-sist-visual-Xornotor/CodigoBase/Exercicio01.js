// Construindo um sistema planetário.

import * as THREE from 'three';
import { GUI } 		from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js'

const 	rendSize 	= new THREE.Vector2();

var 	gui 		= new GUI();

var 	scene,
		renderer,
		camera,
		controls;

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

	console.log(scene.getObjectByName("ObjTerraLua").children[1]);
		
	renderer.clear();
	renderer.render(scene, camera);
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

	// Sistema Solar

	// Eixo do Sol
	var sAxis = new THREE.AxesHelper(4.8);

	// Sol
	var sol = new THREE.Mesh 	( 	new THREE.SphereGeometry( 4.0, 20, 20), 
									new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe:true} ) 
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
									new THREE.MeshBasicMaterial( {color: 0x0000ff, wireframe:true} ) 
								);
	terra.name = "Terra";
	terra.position.set(0.0, 0.0, 0.0);
	terra.add(tAxis);
	terraLua.add(terra);	

	// Eixo da Lua
	var lAxis = new THREE.AxesHelper(0.6);

	// Lua
	var lua = new THREE.Mesh 	( 	new THREE.SphereGeometry( 0.5, 10, 10 ), 
									new THREE.MeshBasicMaterial( {color: 0xaaaaaa, wireframe:true} ) 
								);
	lua.name = "Lua";	
	lua.add(lAxis);

	var luaRotTerra = new THREE.Object3D();
	lua.position.set(0.0, 2.3, 0.0);
	luaRotTerra.add(lua);
	luaRotTerra.name = "LuaRotTerra";

	terraLua.add(luaRotTerra);
	terraLua.position.set(8.2, 0.0, 0.0);

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
	let rotSol		= 0.003;	// Rotação da Terra-Lua ao redor do sol

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

		obj.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), rotTerraLua);
		
		obj.updateMatrix();
	}

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
