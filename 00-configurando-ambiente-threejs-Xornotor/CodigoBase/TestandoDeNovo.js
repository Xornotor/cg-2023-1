// Ainda testando a instalação do Three.JS

import * as THREE 			from 'three';
import { GLTFLoader } 		from '../../Assets/scripts/three.js/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls }	from '../../Assets/scripts/three.js/examples/jsm/controls/OrbitControls.js';

const 	rendSize = new THREE.Vector2();

var 	scene,
		renderer, 
		camera, 
		mesh,
		orbitControls,
		clock,
		controls;

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

	camera = new THREE.PerspectiveCamera( 65.0, rendSize.x / rendSize.y, 0.01, 300.0 );
	
	scene.add( camera );
	
	// Controle de Camera Orbital
	orbitControls = new OrbitControls(camera, renderer.domElement);
	orbitControls.autoRotate = false;

    const path          = "../../Assets/Textures/Cubemaps/mountain-skyboxes/Teide/";
    const textCubeMap   =    [  path + "negx.jpg", 
                                path + "posx.jpg",
                                path + "posy.jpg", 
                                path + "negy.jpg",
                                path + "negz.jpg", 
                                path + "posz.jpg"
                            ];

    const textureCube       = new THREE.CubeTextureLoader().load( textCubeMap );
    scene.background        = textureCube;

	// Load Mesh
	const gltfLoader = new GLTFLoader();
	gltfLoader.load('../../Assets/Models/glTF/abandoned_farm_house/scene.gltf', loadMesh);

	render();
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function loadMesh(loadedMesh) {
		
	const root = loadedMesh.scene;
	root.name = "farm";
	scene.add(root);
	
	const helper = new THREE.BoxHelper();
	helper.setFromObject(root);

	helper.geometry.computeBoundingBox();

	const max = helper.geometry.boundingBox.max;
	const min = helper.geometry.boundingBox.min;
	
	camera.position.x = (min.x + max.x) / 2.0;
	camera.position.y = max.y / 2.0;
	camera.position.z = max.z;
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
								0.0, 
								max.z*1.2);
	scene.add(pointLight1);
	
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

	renderer.render(scene, camera);
	requestAnimationFrame(render);
};

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
