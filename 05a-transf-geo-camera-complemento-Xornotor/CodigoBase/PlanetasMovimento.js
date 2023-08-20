// Construindo um sistema planetário.

import * as THREE from 'three';

const 	rendSize 	= new THREE.Vector2();

const 	clock 		= new THREE.Clock();

var 	scene,
		renderer,
		camera;

var		tempo = 0.0;

var		luaRastroPoints = [],
		terraRastroPoints = [],
		solRastroPoints = [];

var		maxLenRastro = 700;

var		solRastroMat,
		terraRastroMat,
		luaRastroMat;

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function main() {

	renderer = new THREE.WebGLRenderer({antialias: true});

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	
	//renderer.autoClear = false;

	rendSize.x = 
	rendSize.y = Math.min(window.innerWidth, window.innerHeight) * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();

	camera = new THREE.OrthographicCamera( -12.0, 12.0, 12.0, -12.0, -30.0, 30.0 );
	camera.position.set(5, 5, 5);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	//camera.rotation.copy(new THREE.Euler(0, Math.PI/4, 0));
	scene.add( camera );

	buildScene();
		
	renderer.clear();
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
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
									new THREE.MeshBasicMaterial( {color: 0xffff00} ) 
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
									new THREE.MeshBasicMaterial( {color: 0x0000ff} ) 
								);
	terra.name = "Terra";
	terra.position.set(0.0, 0.0, 0.0);
	terra.add(tAxis);
	terraLua.add(terra);	

	// Eixo da Lua
	var lAxis = new THREE.AxesHelper(0.6);

	// Lua
	var lua = new THREE.Mesh 	( 	new THREE.SphereGeometry( 0.5, 10, 10 ), 
									new THREE.MeshBasicMaterial( {color: 0xaaaaaa} ) 
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

	solRastroMat = new THREE.LineBasicMaterial( {
		color: 0xfff00f,
		linewidth: 1,
	} );

	terraRastroMat = new THREE.LineBasicMaterial( {
		color: 0x3322ff,
		linewidth: 1,
	} );

	luaRastroMat = new THREE.LineBasicMaterial( {
		color: 0x999999,
		linewidth: 1,
	} );

	var luaPos = new THREE.Vector3();
	var terraPos = new THREE.Vector3();
	var solPos = new THREE.Vector3();
	
	scene.getObjectByName("Lua").getWorldPosition(luaPos);
	scene.getObjectByName("Terra").getWorldPosition(terraPos);
	scene.getObjectByName("Sol").getWorldPosition(solPos);

	luaRastroPoints.push(luaPos);
	terraRastroPoints.push(terraPos);
	solRastroPoints.push(solPos);

	var luaGeometry = new THREE.BufferGeometry().setFromPoints( luaRastroPoints );
	var luaRastro = new THREE.Line( luaGeometry , luaRastroMat );
	luaRastro.name = "luaRastro";
	scene.add( luaRastro );	

	var terraGeometry = new THREE.BufferGeometry().setFromPoints( terraRastroPoints );
	var terraRastro = new THREE.Line( terraGeometry , terraRastroMat );
	terraRastro.name = "terraRastro";
	scene.add( terraRastro );

	var solGeometry = new THREE.BufferGeometry().setFromPoints( solRastroPoints );
	var solRastro = new THREE.Line( solGeometry , solRastroMat );
	solRastro.name = "solRastro";
	scene.add( solRastro );

};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function animate() {

	let delta = clock.getDelta();
	tempo += delta;

	camera.position.set(5, 5, 5 + 3*Math.sin(tempo));
	//camera.lookAt(new THREE.Vector3(0, 0, 0));

	let rotTerraLua	= 0.07;	// Rotação da Lua ao redor da Terra
	let rotTerra 	= 0.2;		// Rotação da Terra ao redor de seu eixo (Y)
	let rotLua 		= 0.015;		// Rotação da Lua ao redor do seu eixo (Y)
	let rotSol		= 0.01;	// Rotação da Terra-Lua ao redor do sol

	var obj;

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
	obj.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), rotSol);
	obj.updateMatrix();

	for(var point of luaRastroPoints){
		point.z += 0.06;
	}

	for(var point of terraRastroPoints){
		point.z += 0.06;
	}

	for(var point of solRastroPoints){
		point.z += 0.06;
	}

	var luaPos = new THREE.Vector3();
	var terraPos = new THREE.Vector3();
	var solPos = new THREE.Vector3();
	
	scene.getObjectByName("Lua").getWorldPosition(luaPos);
	scene.getObjectByName("Terra").getWorldPosition(terraPos);
	scene.getObjectByName("Sol").getWorldPosition(solPos);

	luaRastroPoints.push(luaPos);
	terraRastroPoints.push(terraPos);
	solRastroPoints.push(solPos);

	if(luaRastroPoints.length > maxLenRastro){
		luaRastroPoints.shift();
	}

	if(terraRastroPoints.length > maxLenRastro){
		terraRastroPoints.shift();
	}

	if(solRastroPoints.length > maxLenRastro){
		solRastroPoints.shift();
	}

	obj = scene.getObjectByName("luaRastro");
	var geometry = new THREE.BufferGeometry().setFromPoints( luaRastroPoints );
	obj.geometry = geometry;

	obj = scene.getObjectByName("terraRastro");
	geometry = new THREE.BufferGeometry().setFromPoints( terraRastroPoints );
	obj.geometry = geometry;

	obj = scene.getObjectByName("solRastro");
	geometry = new THREE.BufferGeometry().setFromPoints( solRastroPoints );
	obj.geometry = geometry;	

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
