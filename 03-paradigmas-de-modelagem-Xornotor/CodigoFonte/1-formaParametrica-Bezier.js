// Modificando a geometria do terreno utilizando Vertex Shader

import * as THREE from 'three';

const 	rendSize 	= new THREE.Vector2();

var 	scene,
		camera,
		renderer,
		shaderMat,
		teta=0;

const	pointAmount = 50;

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	rendSize.x = window.innerWidth * 0.8;
	rendSize.y = window.innerHeight * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();

	camera = new THREE.OrthographicCamera( -1.5, 1.5, 1.5, -1.5, -1.0, 1.0 );

    geraCurva();

   	renderer.clear();
	renderer.render(scene, camera);

    requestAnimationFrame(anime);
}

// ******************************************************************** //
// **                                                                ** //
// ******************************************************************** //
function geraCurva() {

	var ptosControle = 	[ 	new THREE.Vector3( -1.0, math.sin(0) / 2.0, 0.0 ),
							new THREE.Vector3( -0.5, math.sin(math.PI/2.0) / 2.0, 0.0 ),
							new THREE.Vector3(  0.5, math.sin(3.0*math.PI/2.0) / 2.0, 0.0 ),
							new THREE.Vector3(  1.0, math.sin(math.PI) / 2.0, 0.0 )
						];

	var poligonalCtrl = [];

	for (var i=0 ; i < ptosControle.length ; i++) 
		poligonalCtrl.push(ptosControle[i]);

	const objPolCtrl 		= new THREE.Line (	new THREE.BufferGeometry().setFromPoints(poligonalCtrl),
												new THREE.LineBasicMaterial( {color: 0xFFFFFF})
											);
	objPolCtrl.name 		= "poligonalControle";
	scene.add(objPolCtrl);

	shaderMat = new THREE.ShaderMaterial( { 
		uniforms : {	
			uControlPts		: { value  	: ptosControle }
		},
		vertexShader 	: document.getElementById('VertShader').textContent,
		fragmentShader 	: document.getElementById('FragShader').textContent,
		wireframe  		: false,
		side 			: THREE.DoubleSide
	} );

	var rawPts	=	[];
	for(var i = 0; i < pointAmount; i++){
		var x_pos = -1.0 + (2.0 * i/(pointAmount - 1));
		rawPts.push(new THREE.Vector3(x_pos, 0.0, 0.0));
	}

	const objCurvaBezier 	= new THREE.Line 	( 	new THREE.BufferGeometry().setFromPoints( rawPts ), 
													shaderMat 
												);

    objCurvaBezier.name 	= "curvaBezier";
	scene.add( objCurvaBezier );
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************
function anime(time) {
	var ptosControle = 	[ 	new THREE.Vector3( -1.0, math.sin(0) / 2.0, 0.0 ),
							new THREE.Vector3( -0.5, math.sin(math.PI/2.0+teta) / 2.0, 0.0 ),
							new THREE.Vector3(  0.5, math.sin(3.0*math.PI/2.0+teta) / 2.0, 0.0 ),
							new THREE.Vector3(  1.0, math.sin(math.PI) / 2.0, 0.0 )
						];

	const vPC 		= scene.getObjectByName("poligonalControle").geometry.attributes.position.array;

	vPC[1*3+1] = ptosControle[1].y;
	vPC[2*3+1] = ptosControle[2].y;

	scene.getObjectByName("poligonalControle").geometry.attributes.position.needsUpdate = true; 

	shaderMat.uniforms.uControlPts.value = ptosControle;
	shaderMat.uniforms.uControlPts.needsUpdate = true;

	teta += 0.01;

	renderer.clear();
	renderer.render(scene, camera);

	requestAnimationFrame(anime);		
}

// ******************************************************************** //
// ******************************************************************** //
// ******************************************************************** //

main();
