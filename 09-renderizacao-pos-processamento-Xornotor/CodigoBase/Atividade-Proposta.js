// Mapeamento de Texturas 
import * as THREE           from 'three';
import { OrbitControls }    from '../project_assets/scripts/three.js/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } 		from '../project_assets/scripts/three.js/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from '../project_assets/scripts/three.js/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPixelatedPass } from '../project_assets/scripts/three.js/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { RenderPass } from '../project_assets/scripts/three.js/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from '../project_assets/scripts/three.js/examples/jsm/postprocessing/GlitchPass.js';
import { GUI } from '../project_assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js';

const   rendSize    = new THREE.Vector2();

var     renderer,
        scene,
        camera,
        cameraControl,
        cubeCamera,
        controles;

var     skinHand,
        normalHand,
        roughnessHand;

var     skinGuitar,
        normalGuitar,
        roughnessGuitar;

var     composer;

var     renderPixelatedPass,
        glitchPass;

const 	gui = new GUI();


function main() {

    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

    rendSize.x = window.innerWidth*0.8;
    rendSize.y = window.innerHeight*0.8;

    renderer.setSize(rendSize.x, rendSize.y);

    document.body.appendChild(renderer.domElement);

    scene   = new THREE.Scene();
    
    camera              = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x   = 25;
    camera.position.y   = 10;
    camera.position.z   = 63;
    camera.lookAt(scene.position);

    cameraControl           = new OrbitControls(camera, renderer.domElement);
    cameraControl.enablePan = false;

    criaCena();

    iluminacaoCenica();

    composer = new EffectComposer( renderer );

    const renderPass = new RenderPass( scene, camera );
	composer.addPass( renderPass );

    renderPixelatedPass = new RenderPixelatedPass( 6, scene, camera );
	composer.addPass( renderPixelatedPass );

    glitchPass = new GlitchPass();
    composer.addPass( glitchPass );

    start_GUI();

    render();
}

function criaCena() {    

    // cria Mapeamento de Ambiente
    const path          = "../project_assets/Textures/Cubemaps/SwedishRoyalCastle/";
    const textCubeMap   =    [  path + "px.jpg", 
                                path + "nx.jpg",
                                path + "py.jpg", 
                                path + "ny.jpg",
                                path + "pz.jpg", 
                                path + "nz.jpg",
                                
                            ];

    const textureCube   = new THREE.CubeTextureLoader().load( textCubeMap );
    textureCube.mapping = THREE.CubeReflectionMapping;
    scene.background    = textureCube;

    // Create cube render target
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, {    format: THREE.RGBFormat, 
                                                                        generateMipmaps: true, 
                                                                        minFilter: THREE.LinearMipmapLinearFilter } );   
    // cria uma camera para geracao do cubemap
    cubeCamera       = new THREE.CubeCamera(1.0, 1000.0, cubeRenderTarget );
    scene.add(cubeCamera);

    // cria os materiais para o mapeamento do ambiente dinamico e estatico
    const dynamicEnvMaterial   = new THREE.MeshBasicMaterial(  {   envMap: cubeCamera.renderTarget.texture, 
                                                                   side: THREE.DoubleSide});

    // cria esfera espelhada com mapemento dinamico
    const mirrorSphere  = new THREE.Mesh(   new THREE.SphereGeometry(15, 60, 60), 
                                            dynamicEnvMaterial);
    mirrorSphere.name   = "esfera-espelhada"
    scene.add(mirrorSphere);

    skinHand		= new THREE.TextureLoader().load("../project_assets/Models/hand/textures/Hands_Low_defaultMat1_baseColor.jpg");
	skinHand.flipY = false;

    normalHand		= new THREE.TextureLoader().load("../project_assets/Models/hand/textures/Hands_Low_defaultMat1_normal.png");
	normalHand.flipY = false;

    roughnessHand 	= new THREE.TextureLoader().load("../project_assets/Models/hand/textures/Hands_Low_defaultMat1_metallicRoughness.png");
    roughnessHand.flipY = false;

    var handLoader 	= new GLTFLoader().load("../project_assets/Models/hand/scene.gltf", loadHand);
    
    skinGuitar		= new THREE.TextureLoader().load("../project_assets/Models/low_poly_guitar/textures/Material_295_baseColor.png");
	skinGuitar.flipY = false;

    normalGuitar	= new THREE.TextureLoader().load("../project_assets/Models/low_poly_guitar/textures/Material_295_normal.png");
	normalGuitar.flipY = false;
    
    roughnessGuitar	= new THREE.TextureLoader().load("../project_assets/Models/low_poly_guitar/textures/Material_295_metallicRoughness.png");
    roughnessGuitar.flipY = false;

    var guitarLoader 	= new GLTFLoader().load("../project_assets/Models/low_poly_guitar/scene.gltf", loadGuitar);

}

function iluminacaoCenica(){

    let hemisphere = new THREE.HemisphereLight( 0x555555, 0x111111 );
    let point1 = new THREE.PointLight(0xEACF9D, 0.35, 600);
    point1.position.set(0, 7, 100)
    let point2 = new THREE.PointLight(0xDFC29B, 0.45, 800);
    point2.position.set(70, 45, 100)
    let point3 = new THREE.PointLight(0xDFC29B, 0.4, 400);
    point3.position.set(-150, 0, 0)
    let point4 = new THREE.PointLight(0xDFC29B, 0.45, 800);
    point4.position.set(-70, 45, -100)
    let point5 = new THREE.PointLight(0xDFC29B, 0.35, 800);
    point5.position.set(40, 40, -100)
    let point6 = new THREE.PointLight(0xEACF9D, 0.20, 500);
    point6.position.set(0, 7, -100)
    let point7 = new THREE.PointLight(0xDFC29B, 0.35, 400);
    point3.position.set(150, 0, 0)

    scene.add( hemisphere );
    scene.add( point1 );
    scene.add( point2 );
    scene.add( point3 );
    scene.add( point4 );
    scene.add( point5 );
    scene.add( point6 );
    scene.add( point7 );

}

function start_GUI() {

	controles = 	{	Pixelated : true,
						Glitch:	true,
					};

	gui.add( controles, 'Pixelated').onChange(pixelToggle);
    gui.add( controles, 'Glitch').onChange(glitchToggle);
	gui.open();
};

function pixelToggle(val){
    renderPixelatedPass.enabled = val;
}

function glitchToggle(val){
    glitchPass.enabled = val;
}

function loadHand(gltf) {

	const material 		= new THREE.MeshPhongMaterial( {	
                                    map 		    : skinHand,
									color  		    : 0xefefef,
									normalMap 	    : normalHand,
									normalMapType 	: THREE.TangentSpaceNormalMap,
									normalScale  	: new THREE.Vector2( 0.8, 0.8 ),
                                    side            : THREE.DoubleSide
								} );

	var mesh = new THREE.Mesh( gltf.scene.children[0].geometry, material );

    mesh.position.set(-22, 0, 0);
    mesh.scale.set(5.5, 5.5, 5.5);
    mesh.rotation.set(0, 3.4, 0.75);

	mesh.name = "hand";

	scene.add( mesh );
	
	

	cameraControl.update();
}

function loadGuitar(gltf) {

	const material 		= new THREE.MeshStandardMaterial( {	
                                    map 		    : skinGuitar,
									normalMap 	    : normalGuitar,
									normalMapType 	: THREE.TangentSpaceNormalMap,
									normalScale  	: new THREE.Vector2( 0.8, 0.8 ),
                                    roughness       : 0.9,
                                    roughnessMap    : roughnessGuitar
								} );	

    let geometry = gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0].geometry;

	var mesh = new THREE.Mesh( geometry , material );

	mesh.name = "guitar";

    mesh.position.set(25, 0, 0);
    mesh.scale.set(0.3, 0.3, 0.3)

	scene.add( mesh );
	
	cameraControl.update();
}

function render() {

    cameraControl.update();

    
    let obj = scene.getObjectByName("guitar");
    
    if (obj) {
    	obj.rotation.x      +=0.008;
    }

    obj = scene.getObjectByName("hand");
    if (obj) 
        obj.rotation.x  += 0.012;

    obj = scene.getObjectByName("esfera-espelhada");
    if (obj) {
    	obj.visible = false;
    	cubeCamera.update(renderer, scene);
    	obj.visible = true;
        }

    requestAnimationFrame(render);

    composer.render();
}

main();
