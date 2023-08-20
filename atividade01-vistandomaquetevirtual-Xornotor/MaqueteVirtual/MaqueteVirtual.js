/*
 * Projeto de visita a Maquete Virtual
 * Disciplina: MATA65 - Computação Gráfica - 2023.1
 * Aluno: André Paiva Conrado Rodrigues
 * Universidade Federal da Bahia 
*/

// Imports
import * as THREE 				from 'three';
import { GLTFLoader } 			from '../Assets/scripts/three.js/examples/jsm/loaders/GLTFLoader.js';
import { FlyControls }			from '../Assets/scripts/three.js/examples/jsm/controls/FlyControls.js';
import { FirstPersonControls }	from '../Assets/scripts/three.js/examples/jsm/controls/FirstPersonControls.js';
import { GUI } 					from '../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js';

// Variáveis de cena, render e GUI
var 	scene,
		renderer,
		controles;

// Variáveis de câmeras
var		camInterna,
		camExterna,
		camGuiada;

// Variáveis de controladores de câmera
var		ctrlInterna,
		ctrlExterna;

// Variável de seleção de câmera
var		camSelecionada 	= 'Visita Guiada';

// Variáveis de modelos GLTF e animações
var		casa,
		avatar_a, avatar_a_anim,
		avatar_b, avatar_b_anim,
		avatar_c, avatar_c_anim;

var		vx, vy, vz;

// Tamanho do Render
const 	rendSize 		= new THREE.Vector2();

// Clock para animações
const 	clock 			= new THREE.Clock();

// Inicialização do GUI
const 	gui 			= new GUI();

// Variáveis de controllers do GUI
var		planoSelectGui,
		planoPositionGui;

// Posição e ângulo inicial da câmera de visita interna
const	initPosInterna	= new THREE.Vector3(-4, 2.15, -0.8);
const	initLookInterna	= new THREE.Vector3(0, 0, 0);
var		prevPosInterna	= new THREE.Vector3(0, 0, 0);
prevPosInterna.copy(initPosInterna);

// Posição e ângulo inicial da câmera de visita externa
const	initPosExterna	= new THREE.Vector3(0, 1, 8.58);
const	initLookExterna	= new THREE.Vector3(0, 0, 0);
var		prevPosExterna	= new THREE.Vector3(0, 0, 0);
prevPosExterna.copy(initPosExterna);

// Posições da câmera guiada
const	posicoesGuia	= [	
							new THREE.Vector3(6, 5, 7),
							new THREE.Vector3(5, 2.5, -2.7),
							new THREE.Vector3(-6, 2.5, -6),
							new THREE.Vector3(-3, 3, -5),
							new THREE.Vector3(1, 2, -5),
							new THREE.Vector3(-1, 5, -7),
							new THREE.Vector3(2, 5, -0.9),
						];

// Ângulos da câmera guiada
const	angulosGuia		= [	
							new THREE.Vector3(0, 2.5, 0),
							new THREE.Vector3(0, 1, -5),
							new THREE.Vector3(2, 1, 0),
							new THREE.Vector3(-3, 2.4, -7),
							new THREE.Vector3(6, 2, -0.9),
							new THREE.Vector3(0, 4.5, -0.9),
							new THREE.Vector3(-10, 0, -12),
						];

// Variáveis de controle para transição de câmera guiada;
var		tempoPosGuia	= 0.0;
const	totalPosGuia 	= posicoesGuia.length;

// Planos de corte
const	planoXY 		= new THREE.Plane(new THREE.Vector3(0, 0, -1), 1);
const	planoXZ 		= new THREE.Plane(new THREE.Vector3(0, -1, 0), 1);
const	planoYZ 		= new THREE.Plane(new THREE.Vector3(1, 0, 0), 1);
var		plano 			= new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);

// Listener para redimensionamento de janela do browser
window.addEventListener( 'resize', onWindowResize, false );

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Função main
function main() {

	renderer = new THREE.WebGLRenderer({antialias: true,});

	renderer.setClearColor(new THREE.Color(0.6, 0.8, 1.0));

	rendSize.x = window.innerWidth;
	rendSize.y = window.innerHeight;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();
	
	createCameras();
	addLights();
	loadAllModels();
	start_GUI();

	render();
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Reajuste da aplicação ao redimensionar janela do browser
function onWindowResize(){

	rendSize.x = window.innerWidth;
	rendSize.y = window.innerHeight;

	renderer.setSize(rendSize.x, rendSize.y);

	let asp_ratio = window.innerWidth/window.innerHeight;

	camInterna.aspect = asp_ratio;
    camInterna.updateProjectionMatrix();
	ctrlInterna.handleResize();
	camExterna.aspect = asp_ratio;
    camExterna.updateProjectionMatrix();
    camGuiada.aspect = asp_ratio;
    camGuiada.updateProjectionMatrix();

}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// GUI de interação com o usuário
function start_GUI() {

	controles = 	{	Visita : 		"Visita Guiada",
						PlanoCorte:		"Desativado",
						PosicaoCorte: 	0.0,
					};

	gui.add( controles, 'Visita', 		[ 	"Visita Interna",
											"Visita Externa",  
											"Visita Guiada"] ).onChange(changeCamera);
	planoSelectGui = gui.add( controles, 'PlanoCorte',	[ 	"Desativado",
											"Plano XY",  
											"Plano XZ",
											"Plano YZ"] ).onChange(changePlanoCorte);
	planoPositionGui = gui.add( controles, 'PosicaoCorte', -11.0, 11.0).onChange(changePosCorte);
	planoPositionGui.disable(true);
	gui.open();
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Inicialização das câmeras
function createCameras(){
	let asp_ratio = window.innerWidth/window.innerHeight;
	camInterna = new THREE.PerspectiveCamera( 45.0, asp_ratio, 0.01, 500.0);
	camExterna = new THREE.PerspectiveCamera( 45.0, asp_ratio, 0.01, 500.0);
	camGuiada = new THREE.PerspectiveCamera( 80.0, asp_ratio, 0.01, 500.0);

	ctrlInterna = new FirstPersonControls(camInterna, renderer.domElement);
	ctrlExterna = new FlyControls(camExterna, renderer.domElement);

	camInterna.position.copy(initPosInterna);
	camInterna.lookAt(initLookInterna.x, initLookInterna.y, initLookInterna.z);
	ctrlInterna.movementSpeed = 1.3;
	ctrlInterna.lookSpeed = 0.045;

	camExterna.position.copy(initPosExterna);
	camExterna.lookAt(initLookExterna.x, initLookExterna.y, initLookExterna.z);
	//ctrlExterna.dragToLook = true;
	ctrlExterna.movementSpeed = 1;
	ctrlExterna.rollSpeed = 0.065;

	camGuiada.position.copy(posicoesGuia[0]);
	camGuiada.lookAt(angulosGuia[0].x, angulosGuia[0].y, angulosGuia[0].z)
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Configuração de iluminação cênica
function addLights(){
	const ambiLight = new THREE.AmbientLight( 0xffffee, 0.8 );
	scene.add( ambiLight );

	const rectLight = new THREE.DirectionalLight( 0xffffff, 0.59);
	rectLight.castShadow = true;
	rectLight.position.set( 5, 20, 50 );
	rectLight.lookAt( 0, 0, 0 );
	scene.add( rectLight )
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Carregamento dos modelos GLTF

function loadAllModels(){
	const loader = new GLTFLoader();
	loader.load('../gltf/wooden_house/scene.gltf', loadHome);
	loader.load('../gltf/avatar_a/scene.gltf', loadAvatarA);
	loader.load('../gltf/avatar_b/scene.gltf', loadAvatarB);
	loader.load('../gltf/avatar_c/scene.gltf', loadAvatarC);
}

// Carregamento do GLTF da casa
function loadHome(gltf_casa) {
	casa = gltf_casa.scene.children[0];
	casa.name = "casa";
	casa.material = new THREE.MeshBasicMaterial();
	casa.children[0].material = new THREE.MeshBasicMaterial();
	casa.traverse(updateCorte);
	scene.add(casa);
};

// Carregamento do GLTF do Avatar 1
function loadAvatarA(gltf_avatar) {
	avatar_a = gltf_avatar.scene;
	scene.add(avatar_a);
	avatar_a.position.set(0, 0.86, 3);
	avatar_a.scale.set(0.8, 0.8, 0.8);
	avatar_a_anim = new THREE.AnimationMixer(avatar_a);
	avatar_a_anim.clipAction(gltf_avatar.animations[0]).play();
};

// Carregamento do GLTF do Avatar 2
function loadAvatarB(gltf_avatar) {
	avatar_b = gltf_avatar.scene;
	scene.add(avatar_b);
	avatar_b.position.set(1.4, 0.86, -6);
	avatar_b.scale.set(0.5, 0.5, 0.5);
	avatar_b_anim = new THREE.AnimationMixer(avatar_b);
	avatar_b_anim.clipAction(gltf_avatar.animations[0]).play();
};

// Carregamento do GLTF do Avatar 3
function loadAvatarC(gltf_avatar) {
	avatar_c = gltf_avatar.scene;
	scene.add(avatar_c);
	avatar_c.position.set(2.6, 3.805, 1.6)
	avatar_c.scale.set(0.0087, 0.0087, 0.0087);
	avatar_c_anim = new THREE.AnimationMixer(avatar_c);
	avatar_c_anim.clipAction(gltf_avatar.animations[0]).play();
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Mudança de câmera ao selecionar modo de visita
function changeCamera(value){
	camSelecionada = value;
	camInterna.updateProjectionMatrix();
	camExterna.updateProjectionMatrix();
	camGuiada.updateProjectionMatrix();

	ctrlInterna.enabled = ctrlExterna.enabled = true;

	if(value == 'Visita Interna'){
		ctrlExterna.enabled = false;
	}else if(value == 'Visita Externa'){
		ctrlInterna.enabled = false;
	}else if(value == 'Visita Guiada'){
		ctrlInterna.enabled = ctrlExterna.enabled = false;
		tempoPosGuia = 0.0;
	}

	configClipping();
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Mudança de eixos do plano de corte
function changePlanoCorte(val){
	var plano_casa = scene.getObjectByName("casa").material.clippingPlanes[0];

	if(val == 'Plano XY'){
		plano_casa.set(planoXY.normal, plano_casa.constant);
	}else if(val == 'Plano XZ'){
		plano_casa.set(planoXZ.normal, plano_casa.constant);
	}else if(val == 'Plano YZ'){
		plano_casa.set(planoYZ.normal, plano_casa.constant);
	}

	if(val == 'Desativado') planoPositionGui.disable(true);
	else planoPositionGui.disable(false);

	configClipping();
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Mudança de posição/altura do plano de corte
function changePosCorte(val){
	var plano_casa = scene.getObjectByName("casa").material.clippingPlanes[0];
	plano_casa.set(plano_casa.normal, val);

	configClipping();
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Update do corte em todas as submeshes da casa
function updateCorte(obj){
	obj.material.clippingPlanes = [plano];
	obj.material.clipShadows = true;
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Configuração de Clipping
function configClipping(){
	var clipEnabled;
	if(planoSelectGui.getValue() != 'Desativado' && camSelecionada == 'Visita Externa'){
		clipEnabled = true;	
		avatar_a.visible = avatar_b.visible = avatar_c.visible = false;
	}else{
		clipEnabled = false;
		avatar_a.visible = avatar_b.visible = avatar_c.visible = true;
	}

	renderer.localClippingEnabled = clipEnabled;
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

//Limitação de movimento na visita interna (térreo)
function internalTerreoBoundaries(){
	let pos = camInterna.position;

	var terreo_1 = pos.x >= -6.3 && pos.x <= 5.22 &&
					pos.z >= -5.8 && pos.z <= -4.7 &&
					pos.y >= 2.0 && pos.y <= 2.3;

	var terreo_2 = pos.x >= -4.2 && pos.x <= 3.44 &&
					pos.z >= -5.8 && pos.z <= -0.65 &&
					pos.y >= 2.0 && pos.y <= 2.3;

	var terreo_3 = pos.x >= 2.0 && pos.x <= 3.55 &&
					pos.z >= -5.8 && pos.z <= -2 &&
					pos.y >= 2.0 && pos.y <= 2.3;

	return terreo_1 || terreo_2 || terreo_3;
}

// Limitação de movimento e interpolação de altura na escada
// (Visita interna)
function internalEscadaBoundaries(){
	let pos = camInterna.position;

	var escada_1 = pos.x >= 2.55 && pos.x <= 5.22 &&
					pos.z >= -1.42 && pos.z <= -0.65 &&
					pos.y >= 2.0 && pos.y <= 3.7;

	var escada_2 = pos.x >= 4.7 && pos.x <= 5.22 &&
					pos.z >= -4.17 && pos.z <= -0.65 &&
					pos.y >= 3.3 && pos.y <= 5.3;

	// Parametrização para interpolação de altura na escada
	if(escada_1){
		camInterna.position.y = (1 - ((pos.x - 2.55)/(5.22 - 2.55))) * 2.15 +
								((pos.x - 2.55)/(5.22 - 2.55)) * 3.5;
	}else if(escada_2){
		camInterna.position.y = (1 - ((pos.z + 4.17))/((-1.41) + 4.17)) * 5.1 +
								((pos.z + 4.17)/((-1.41) + 4.17)) * 3.5;
	}

	return escada_1 || escada_2;
}

//Limitação de movimento na visita interna (primeiro andar)
function internalAndarBoundaries(){
	let pos = camInterna.position;

	var andar_1 = pos.x >= -5.75 && pos.x <= 1.95 &&
		pos.z >= -5.68 && pos.z <= 1.85 &&
		pos.y >= 4.9 && pos.y <= 5.3;

	var andar_2 = pos.x >= -5.75 && pos.x <= 5.22 &&
		pos.z >= -5.68 && pos.z <= -4.17 &&
		pos.y >= 4.9 && pos.y <= 5.3;

	return andar_1 || andar_2;
}

// Limitação de movimento na visita interna (completo)
function internalBoundaries(){
	let terreo = internalTerreoBoundaries();
	let escada = internalEscadaBoundaries();
	let andar = internalAndarBoundaries();

	if(terreo && !escada && !andar) camInterna.position.y = 2.15;
	else if(!terreo && !escada && andar) camInterna.position.y = 5.1;

	return 	(terreo|| escada || andar);
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Limitação de movimento na visita externa (drone)
function externalBoundaries(){
	let pos = camExterna.position;

	var frente 	= 	pos.x >= -16 && pos.x <= 16 &&
					pos.y >= 1 && pos.y <= 15 &&
					pos.z >= 2.93 && pos.z <= 16;

	var tras	=	pos.x >= -16 && pos.x <= 16 &&
					pos.y >= 1 && pos.y <= 15 &&
					pos.z >= -16 && pos.z <= -7.6;

	var esq		=	pos.x >= -16 && pos.x <= -8.3 &&
					pos.y >= 1 && pos.y <= 15 &&
					pos.z >= -16 && pos.z <= 16;

	var dir		=	pos.x >= 7.38 && pos.x <= 16 &&
					pos.y >= 1 && pos.y <= 15 &&
					pos.z >= -16 && pos.z <= 16;

	var teto	=	pos.x >= -16 && pos.x <= 16 &&
					pos.y >= 7.15 && pos.y <= 15 &&
					pos.z >= -16 && pos.z <= 16;

	return frente || tras || esq || dir || teto;
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Mudanças de posição na visita guiada
function transicaoGuiada(delta){
	let tempoCena = 5;

	tempoPosGuia += delta;
	if(tempoPosGuia >= tempoCena * totalPosGuia) tempoPosGuia = 0;
	
	let indexPos = Math.trunc(tempoPosGuia/tempoCena);

	camGuiada.position.copy(posicoesGuia[indexPos]);
	camGuiada.lookAt(	angulosGuia[indexPos].x,
						angulosGuia[indexPos].y,
						angulosGuia[indexPos].z
					);
}

// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Updates nos objetos e câmeras da cena antes do render
function frameUpdates(){
	var delta = clock.getDelta();

	if(camSelecionada == 'Visita Interna') 		ctrlInterna.update( delta );
	else if(camSelecionada == 'Visita Externa') 	ctrlExterna.update( delta );

	if (avatar_a_anim) avatar_a_anim.update( delta );
	if (avatar_b_anim) avatar_b_anim.update( delta );
	if (avatar_c_anim) avatar_c_anim.update( delta );

	if(internalBoundaries()){
		prevPosInterna.copy(camInterna.position);
	}else{
		camInterna.position.copy(prevPosInterna);
	}

	if(externalBoundaries()){
		prevPosExterna.copy(camExterna.position);
	}else{
		camExterna.position.copy(prevPosExterna);
	}

	transicaoGuiada(delta);
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

// Render
function render() {
	frameUpdates();
	if(camSelecionada == 'Visita Externa') renderer.render(scene, camExterna);
	else if(camSelecionada == 'Visita Interna') renderer.render(scene, camInterna);
	else if(camSelecionada == 'Visita Guiada') renderer.render(scene, camGuiada);
	requestAnimationFrame(render);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
