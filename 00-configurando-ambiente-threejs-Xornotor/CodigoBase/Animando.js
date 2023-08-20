// Ainda testando a instalação do Three.JS

import * as THREE 			from 'three';
import { GLTFLoader } 		from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls }	from 'three/addons/controls/OrbitControls.js';

const 	rendSize = new THREE.Vector2();

var 	scene,
		renderer, 
		camera, 
		mesh,
		orbitControls,
		clock,
		controls;

let 	skeleton, mixer, fightAction;


/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function main() {

	clock = new THREE.Clock();
	
	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	rendSize.x = window.innerWidth * 0.8;
	rendSize.y = window.innerHeight * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50.0, rendSize.x / rendSize.y, 0.01, 300.0 );
	
	scene.add( camera );
	
	// Controle de Camera Orbital
	orbitControls = new OrbitControls(camera, renderer.domElement);
	orbitControls.autoRotate = false;

	// Load Mesh
	const gltfLoader = new GLTFLoader();
	gltfLoader.load('../../Assets/Models/glTF/rapid_punching/scene.gltf', loadMesh);

	render();
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function loadMesh(loadedMesh) {
		
	const root = loadedMesh.scene;
	root.name = "Fighters";
	scene.add(root);

	root.traverse( function ( object ) {

						if ( object.isMesh ) object.castShadow = true;

					} );

	skeleton = new THREE.SkeletonHelper( root );
	skeleton.visible = true;
	scene.add( skeleton );

	const animations = loadedMesh.animations;
	mixer = new THREE.AnimationMixer( root );

	fightAction = mixer.clipAction( animations[ 0 ] );

	fightAction.play();

	const helper = new THREE.BoxHelper();
	helper.setFromObject(root);

	helper.geometry.computeBoundingBox();

	const max = helper.geometry.boundingBox.max;
	const min = helper.geometry.boundingBox.min;
	
	camera.position.x = max.x * 1.5;
	camera.position.y = max.y * 2.0;
	camera.position.z = min.z;
	camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

	var farPlane = Math.max(	(max.x - min.x),
								(max.y - min.y),
								(max.z - min.z) );

	camera.far 	= farPlane*10.0;
	camera.updateProjectionMatrix();

	orbitControls.update();
	
	//Add point light Source
	var pointLight1 = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0));
	pointLight1.distance = 0.0;
	pointLight1.position.set(	max.x*1.2, 
								max.y*1.2, 
								max.z*1.2);
	scene.add(pointLight1);
	
	const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	hemiLight.position.set( 0, max.y, 0 );
	scene.add( hemiLight );

	// Global Axis
	var globalAxis = new THREE.AxesHelper	( Math.max(	(max.x - min.x),
														(max.y - min.y),
														(max.z - min.z)
				  									  )
											);
	scene.add( globalAxis );
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function render() {
	var delta = clock.getDelta();
    orbitControls.update(delta);

	var obj = scene.getObjectByName("Fighters");

	if (obj) 
		mixer.update( delta );

	renderer.render(scene, camera);
	requestAnimationFrame(render);
};

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
