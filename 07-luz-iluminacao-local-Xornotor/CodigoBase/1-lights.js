// Luz

import * as THREE 			from 'three';
import { OrbitControls } 	from '../../Assets/scripts/three.js/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } 		from '../../Assets/scripts/three.js/examples/jsm/loaders/OBJLoader.js';
import { TeapotGeometry } 	from '../../Assets/scripts/three.js/examples/jsm/geometries/TeapotGeometry.js';
import { GUI } 				from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js'
import { RectAreaLightUniformsLib } from '../../Assets/scripts/three.js/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { RectAreaLightHelper } from '../../Assets/scripts/three.js/examples/jsm/helpers/RectAreaLightHelper.js';

const   rendSize    	= new THREE.Vector2();

var 	scene 			= null;
var 	renderer		= null;
var 	camera 			= null;
var 	orbitControls	= null;
var 	params			= null;
var 	maxCoord;
var 	materials 		= []; 
var 	lights 			= [];
var 	helperLights 	= [];

const   tMats 			= 	{	BASIC		: 0,
	                           	STANDARD 	: 1,
	                            LAMBERT 	: 2,
	                           	PHONG     	: 3,
	                           	PHYSICAL	: 4,
	                           	TOON		: 5,
	                           	MATCAP      : 6,
	                     	   	DEPTH   	: 7,
	                           	NORMAL 		: 8,
								GOURAUD		: 9,
	                        };

const 	tLights			=  	{	L_AMBIENT 		: 0,
								L_DIRECIONAL1 	: 1,
								L_DIRECIONAL2 	: 2,
								L_DIRECIONAL3 	: 3,
								L_POINT1  		: 4,
								L_POINT2  		: 5,
								L_POINT3  		: 6,
								L_SPOT1  		: 7,
								L_SPOT2  		: 8,
								L_SPOT3  		: 9,
								L_RECTAREA		: 10,
								L_HEMISPHERE	: 11,
								L_MIX			: 12,

							}

var curLight 			= tLights.L_AMBIENT;

var clock  				= new THREE.Clock();
var gui 				= new GUI();

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function main() {

	RectAreaLightUniformsLib.init();

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);

    rendSize.x = window.innerWidth*0.7;
    rendSize.y = window.innerHeight*0.7;

    renderer.setSize(rendSize.x, rendSize.y);
    document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(70.0, rendSize.x/rendSize.y, 0.1, 30.0);
	
	orbitControls 	= new OrbitControls(camera, renderer.domElement);
	
	initMaterials();
	buildScene();
	initLights();
	initGUI();
			
	render();
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function render() {
	var delta = clock.getDelta();
    orbitControls.update(delta);

	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function initMaterials() {

    for (let i = tMats.BASIC ; i <= tMats.GOURAUD ; i++)
		switch (i) {
			case tMats.BASIC 	: 	materials[i] = new THREE.MeshBasicMaterial(	{ 	color 		: 0xAA0088,
																					side		: THREE.DoubleSide } );
									break;

			case tMats.STANDARD : 	materials[i] = new THREE.MeshStandardMaterial( {	color 		: 0xAA0088, 
																						flatShading : true,
																						side		: THREE.DoubleSide
																		  			} );
									break;

			case tMats.LAMBERT 	: 	materials[i] = new THREE.MeshLambertMaterial( {	color 	: 0xb87716,
																					side	: THREE.DoubleSide
																				} );
									break;

			case tMats.PHONG 	: 	materials[i] = new THREE.MeshPhongMaterial( {	color 		: 0x20abc7,
																					specular 	: 0x22e376,
																					reflectivity: 0.7,
																					shininess 	: 20.0,
																					side		: THREE.DoubleSide
																				});
									break;

			case tMats.PHYSICAL	: 	materials[i] = new THREE.MeshPhysicalMaterial( 	{	color 				: 0xd6d6d6,
																						metalness			: 0.8,
																						roughness			: 0.2,
																						clearcoat 			: 0.4,
																						clearcoatRoughness 	: 0.6,
																						side				: THREE.DoubleSide
																					} );
									break;

			case tMats.TOON 	: 	materials[i] = new THREE.MeshToonMaterial(	{	color	: 0xbd5151,
																					side	: THREE.DoubleSide	
																				});	
									break;

			case tMats.DEPTH 	: 	materials[i] = new THREE.MeshDepthMaterial({side	: THREE.DoubleSide});	
									break;

			case tMats.NORMAL 	: 	materials[i] = new THREE.MeshNormalMaterial({side	: THREE.DoubleSide});	
									break;

			case tMats.GOURAUD	:	materials[i] = new THREE.ShaderMaterial( 	
														{ 	vertexShader 	: document.getElementById('gouraudVertShader').textContent,
															fragmentShader 	: document.getElementById('gouraudFragShader').textContent,
															wireframe  		: false,
															side 			: THREE.DoubleSide
														} );
			}

}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function buildScene() {

	const teapot 		= new TeapotGeometry( 15, 18 );
	const mesh 			= new THREE.Mesh( teapot, materials[0] );
	mesh.name 			= "teapot";

	scene.add(mesh);

	var box 			= new THREE.Box3();
	box.setFromObject(mesh);

	// Adjust Camera Position and LookAt	
	maxCoord 			= Math.max(box.max.x,box.max.y,box.max.z);	

	camera.position.x 	= 
	camera.position.y 	= 
	camera.position.z 	= maxCoord;
	camera.far 			= new THREE.Vector3(	maxCoord*5, 
												maxCoord*5, 
												maxCoord*5).length();

	camera.lookAt(new THREE.Vector3(	(box.max.x + box.min.x) / 2.0,
										(box.max.y + box.min.y) / 2.0,
										(box.max.z + box.min.z) / 2.0 ));
	camera.updateProjectionMatrix();

	// Global Axis
	var globalAxis = new THREE.AxesHelper(maxCoord*1.3);
	scene.add( globalAxis );

	// Ground
	var groundMesh = new THREE.Mesh(	new THREE.PlaneBufferGeometry(	maxCoord*200.0, maxCoord*200.0, 50, 50), 
										new THREE.MeshPhongMaterial(	{	color 	: 0x556B2F,
																			side 	: THREE.DoubleSide,
																		} ));

	groundMesh.name 				= "ground";
	groundMesh.rotation.x 			= -Math.PI / 2;
	groundMesh.position.y 			= box.min.y * 1.1;

	scene.add(groundMesh);
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function initLights() {	

    for (let i = tLights.L_AMBIENT ; i <= tLights.L_MIX ; i++) {
    	console.log(i);
		switch (i) {
			case tLights.L_AMBIENT 		: 	lights[i] = new THREE.AmbientLight( 0xFFFFFF, 1.0 );
											lights[i].name 			= "ambLight";
											lights[i].visible 		= true;
											helperLights[i]			= null;											
											break;

			case tLights.L_DIRECIONAL1 	: 	lights[i] = new THREE.DirectionalLight( 0xFFFFFF, 1.0 ); 
											lights[i].name 			= "dirLight1";
											lights[i].visible 		= false;
											lights[i].position.set( 0.0, 0.0, maxCoord );

											helperLights[i]			= new THREE.DirectionalLightHelper( lights[i], 4.0 );
											helperLights[i].name 	= "dirLight1Hlpr";
											helperLights[i].visible	= false;
											break;

			case tLights.L_DIRECIONAL2 	: 	lights[i] = new THREE.DirectionalLight( 0xFFFF00, 1.0 ); 
											lights[i].name 			= "dirLight2";
											lights[i].visible 		= false;
											lights[i].position.set( 0.0, 5.0, 3.0 );
											lights[i].lookAt( 0.0, 0.0, 0.0 );

											helperLights[i]			= new THREE.DirectionalLightHelper( lights[i], 4.0 );
											helperLights[i].name 	= "dirLight2Hlpr";
											helperLights[i].visible	= false;
											break;

			case tLights.L_DIRECIONAL3 	: 	lights[i] = new THREE.DirectionalLight( 0x55FF77, 1.0 ); 
											lights[i].name 			= "dirLight3";
											lights[i].visible 		= false;
											lights[i].position.set( 5.0, -1.0, 2.0 );
											lights[i].lookAt( 0.0, 0.0, 0.0 );

											helperLights[i]			= new THREE.DirectionalLightHelper( lights[i], 4.0 );
											helperLights[i].name 	= "dirLight3Hlpr";
											helperLights[i].visible	= false;
											break;

			case tLights.L_POINT1 	 	: 	lights[i] = new THREE.PointLight( 0xFFFFFF, 1.0 );
											lights[i].name 			= "pntLight1";
											lights[i].visible 		= false;
											lights[i].position.set( 0.0, maxCoord*2.0 , 0.0);

											helperLights[i] 		= new THREE.PointLightHelper( lights[i]);
											helperLights[i].name 	= "pntLight1Hlpr";
											helperLights[i].visible	= false;
											break;

			case tLights.L_POINT2 	 	: 	lights[i] = new THREE.PointLight( 0xAA3322, 1.0 );
											lights[i].name 			= "pntLight2";
											lights[i].visible 		= false;
											lights[i].position.set( 8.0, maxCoord*1.5 , 5.0);

											helperLights[i] 		= new THREE.PointLightHelper( lights[i]);
											helperLights[i].name 	= "pntLight2Hlpr";
											helperLights[i].visible	= false;
											break;

			case tLights.L_POINT3 	 	: 	lights[i] = new THREE.PointLight( 0x99AADD, 1.0 );
											lights[i].name 			= "pntLight3";
											lights[i].visible 		= false;
											lights[i].position.set( -15.0, 2.0 , -15.0);

											helperLights[i] 		= new THREE.PointLightHelper( lights[i]);
											helperLights[i].name 	= "pntLight3Hlpr";
											helperLights[i].visible	= false;
											break;

			case tLights.L_SPOT1 		: 	lights[i] = new THREE.SpotLight( 0xFFFFFF, 1.0, 0.0, Math.PI/6 );
											lights[i].name 			= "sptLight1";
											lights[i].visible 		= false;
											lights[i].position.set(maxCoord, maxCoord, 0.0 );

											helperLights[i] 		= new THREE.SpotLightHelper( lights[i] );
											helperLights[i].name 	= "sptLight1Hlpr";
											helperLights[i].visible	= false;
											break;

			case tLights.L_SPOT2 		: 	lights[i] = new THREE.SpotLight( 0xDE8A2A, 1.0, 0.0, Math.PI/5 );
											lights[i].name 			= "sptLight2";
											lights[i].visible 		= false;
											lights[i].position.set(-20, maxCoord*2.0, 60 );
											lights[i].target.position.set(5, 0, 5);

											helperLights[i] 		= new THREE.SpotLightHelper( lights[i] );
											helperLights[i].name 	= "sptLight2Hlpr";
											helperLights[i].visible	= false;
											break;

			case tLights.L_SPOT3 		: 	lights[i] = new THREE.SpotLight( 0x00FFFF, 1.0, 0.0, Math.PI/5 );
											lights[i].name 			= "sptLight3";
											lights[i].visible 		= false;
											lights[i].position.set(25, 35, -20 );
											lights[i].target.position.set(8, 0, 0);

											helperLights[i] 		= new THREE.SpotLightHelper( lights[i] );
											helperLights[i].name 	= "sptLight3Hlpr";
											helperLights[i].visible	= false;
											break;

			case tLights.L_RECTAREA 	: 	lights[i] = new THREE.RectAreaLight( 0x0088FF, 100.0, 10.0, 10.0 );
											lights[i].name 			= "rectLight";
											lights[i].visible 		= false;
											lights[i].position.set(30, 30, 30 );
											lights[i].lookAt(0, 0, 0);

											helperLights[i] 		= new RectAreaLightHelper( lights[i] );
											helperLights[i].name 	= "rectLightHlpr";
											helperLights[i].visible	= false;
											break;

			case tLights.L_HEMISPHERE 	: 	lights[i] = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1.5 );
											lights[i].name 			= "hemisLight";
											lights[i].visible 		= false;											

											helperLights[i] 		= new THREE.HemisphereLightHelper( lights[i], 5 );
											helperLights[i].name 	= "sptLight3Hlpr";
											helperLights[i].visible	= false;
											break;

			case tLights.L_MIX			:	lights[i] = new THREE.Object3D();
											lights[i].name 			= "mixLight";
											lights[i].visible 		= false;

											var mix_hemis = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.9 );
										
											var mix_dir = new THREE.DirectionalLight( 0x55FF77, 0.6 ); 
											mix_dir.position.set( 5.0, -1.0, 2.0 );
											mix_dir.lookAt( 0.0, 0.0, 0.0 );

											var mix_point = new THREE.PointLight( 0xAA3322, 1.0 );
											mix_point.position.set( 8.0, maxCoord*1.5 , 5.0);

											lights[i].add(mix_hemis);
											lights[i].add(mix_dir);
											lights[i].add(mix_point);

											helperLights[i] 		= null;
											break;

			}
		scene.add( lights[i] );
		if (helperLights[i])
			scene.add( helperLights[i] );
		}
}


/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function initGUI() {	
	params = 	{	luzOn		: true,
					tipoLuz		: "Ambiente",
					ShadeAlg	: "Basic"
				};

	gui.add( params, 'luzOn').onChange(function()	{ 	lights[curLight].visible = params.luzOn;
														if (helperLights[curLight])
															helperLights[curLight].visible = params.luzOn;
													});
	gui.add( params, 'tipoLuz', [ 	"Ambiente", 
									"Direcional1",
									"Direcional2",
									"Direcional3", 
									"Pontual1", 
									"Pontual2",
									"Pontual3",
									"Spot1",
									"Spot2",
									"Spot3",
									"Retangular",
									"Hemisfério",
									"Mix" ] ).onChange(changeLight);

	gui.add( params, 'ShadeAlg', [ 	"Basic",
									"Standard",
									"Lambert",
									"Phong",
									"Physical",
									"Toon",
									"Depth",
									"Normal",
									"Gouraud" ] ).onChange(changeMaterial); 
	gui.open();
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function changeLight() { 

	lights[curLight].visible = false;

	if (helperLights[curLight])
		helperLights[curLight].visible = false;

	switch (params.tipoLuz) {
		case "Ambiente" 	: 	curLight 		= tLights.L_AMBIENT;
								break;

		case "Direcional1" 	: 	curLight 		= tLights.L_DIRECIONAL1;
								break;

		case "Direcional2" 	: 	curLight 		= tLights.L_DIRECIONAL2;
								break;
		
		case "Direcional3" 	: 	curLight 		= tLights.L_DIRECIONAL3;
								break;

		case "Pontual1" 	: 	curLight 		= tLights.L_POINT1;
								break;

		case "Pontual2" 	: 	curLight 		= tLights.L_POINT2;
								break;

		case "Pontual3" 	: 	curLight 		= tLights.L_POINT3;
								break;

		case "Spot1" 		: 	curLight 		= tLights.L_SPOT1;
								break;

		case "Spot2" 		: 	curLight 		= tLights.L_SPOT2;
								break;

		case "Spot3" 		: 	curLight 		= tLights.L_SPOT3;
								break;

		case "Retangular" 	: 	curLight 		= tLights.L_RECTAREA;
								break;

		case "Hemisfério" 	: 	curLight 		= tLights.L_HEMISPHERE;
								break;

		case "Mix" 			: 	curLight 		= tLights.L_MIX;
								break;
		}

	if (params.luzOn) {

		lights[curLight].visible = true;

		if (helperLights[curLight])
			helperLights[curLight].visible = true;
		}
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function changeMaterial() { 

	let obj = scene.getObjectByName("teapot");

	switch (params.ShadeAlg) {
		case "Basic" 	: 	obj.material 				= materials[tMats.BASIC];
							obj.material.flatShading	= true;
							break;

		case "Standard"	: 	obj.material 				= materials[tMats.STANDARD];
							break;

		case "Lambert" 	: 	obj.material 				= materials[tMats.LAMBERT];
							break;

		case "Phong" 	: 	obj.material 				= materials[tMats.PHONG];
							break;

		case "Physical" : 	obj.material 				= materials[tMats.PHYSICAL];
							break;

		case "Toon" 	: 	obj.material 				= materials[tMats.TOON];
							break;

		case "Depth" 	: 	obj.material 				= materials[tMats.DEPTH];
							break;

		case "Normal" 	: 	obj.material 				= materials[tMats.NORMAL];
							break;

		case "Gouraud" 	: 	obj.material 				= materials[tMats.GOURAUD];
							break;

		};
};

main();
