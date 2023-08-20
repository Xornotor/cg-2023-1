// Mapeamento de Texturas 
import * as THREE           from 'three';
import { OrbitControls }    from '../project_assets/scripts/three.js/examples/jsm/controls/OrbitControls.js';

const   rendSize    = new THREE.Vector2();

var     renderer,
        scene,
        camera,
        cameraControl,
        cubeCamera;

function main() {

    renderer = new THREE.WebGLRenderer();

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
    const envMaterial          = new THREE.MeshBasicMaterial(  {   envMap: textureCube, 
                                                                   side: THREE.DoubleSide});
  
    // cria esfera espelhada com mapemento dinamico
    const mirrorSphere  = new THREE.Mesh(   new THREE.SphereGeometry(15, 60, 60), 
                                            dynamicEnvMaterial);
    mirrorSphere.name   = "esfera-espelhada"
    scene.add(mirrorSphere);
    
    // cria cilindro espelhada com mapemento estatico

    const mirrorCylinder    = new THREE.Mesh(   new THREE.CylinderGeometry(10, 4, 20, 20, 20, false), 
                                                envMaterial);
    mirrorCylinder.name     = "cilindro-espelhado"
    mirrorCylinder.position.set(30, 0, 0);
    scene.add(mirrorCylinder);

    // cria cubo espelhada com mapemento estatico
    const mirrorCube   = new THREE.Mesh(   new THREE.BoxGeometry(15, 15, 15), 
                                           envMaterial);
    mirrorCube.name = "cubo-espelhado"
    mirrorCube.position.set(-30, 0, 0);
    scene.add(mirrorCube);
}

function render() {

    cameraControl.update();

    let obj = scene.getObjectByName("cubo-espelhado");
    if (obj) {
    	obj.rotation.y      +=0.005;
    	obj.rotation.x      +=0.005;
        }

    obj = scene.getObjectByName("cilindro-espelhado");
    if (obj) 
        obj.rotation.x  +=0.009;

    obj = scene.getObjectByName("esfera-espelhada");
    if (obj) {
    	obj.visible = false;
    	cubeCamera.update(renderer, scene);
    	obj.visible = true;
        }
	
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

main();
