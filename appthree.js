import * as THREE from 'three';
import { Water } from 'water';
import { Sky} from 'sky';
import { GLTFLoader } from 'GLTFLoader';
import { TransformControls } from 'TransformControls';


var cena = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
var cameraOrt = new THREE.OrthographicCamera(-window.innerWidth /2,window.innerWidth /2,window.innerHeight/2,-window.innerHeight/2,0.1,1000);
var renderer = new THREE.WebGLRenderer();
var cameraAtiva = cameraOrt;

camera.position.set(100,500,0);
camera.lookAt(0,0,0);

cameraOrt.position.set(0, 5, 0); 
cameraOrt.lookAt(0,0,0);

document.body.appendChild( renderer.domElement );

var water;
var sun = new THREE.Vector3();

var focoluz = new THREE.SpotLight('#ffffff',0.5)
focoluz.position.set(0,700,0);
var focosluz = false;

var luzambiente = new THREE.AmbientLight('#ffffff',1);
cena.add(luzambiente) 
var luz_ambiente = true;

document.addEventListener('keydown', function (event) {
    // Letra L
    if (event.keyCode == 76) 
    { 
        if(focosluz)
            {
                cena.remove(focoluz);
                focosluz = false;
                
            }
            else{
                cena.add(focoluz);
                focosluz = true;
                
            }
        }
    if (event.keyCode == 77)//Letra M
        if(luz_ambiente)
        {
            cena.remove(luzambiente);
            luz_ambiente = false;
        }
        else{
            cena.add(luzambiente);
            luz_ambiente = true;
            
        }
        
});

let Tabuleiroplayer1;
let Tabuleiroplayer2;

var loader = new GLTFLoader();

const raycaster = new THREE.Raycaster();
const rato = new THREE.Vector2();

let barcosadcionados1 =[];
let barcosadcionados2 = [];

let jogadorAtual = 1;
let quadradoVermelho1 = 0;
let quadradoVermelho2 = 0;

let torpedo;
let taca;

let intersectsPlayer2;
let intersectsPlayer1;

let player1Div;
let player2Div;
let Vencedor1Div;
let Vencedor2Div;

function Start()
{
    createPlayer1Label();
    CriarOceano();
    AnimacaoMar();
    createImportantButtons();
    TabuleiroPlayer1();
    barcosPlayer1();
    cameraOrt.position.set(0, 5, 0); 
    cameraOrt.lookAt(Tabuleiroplayer1.position);
    cena.add(Tabuleiroplayer1);
    document.addEventListener('keydown', function(event) {
    if(barcosadcionados1.length == 6)
        {
    if (event.keyCode == 13)
        {
            Tabuleiroplayer1.position.set(0,2,1000);
            cameraOrt.position.set(0, 5, 0); 
            cameraOrt.lookAt(0,0,0);
            CriarPlayer2Label();
            document.body.removeChild(player1Div);     
            TabuleiroPlayer2();
            barcosPlayer2();
            document.addEventListener('keydown', function(event) {
                if(barcosadcionados2.length == 6)
                    {
                        if (event.keyCode == 32)
                            {
                                cameraAtiva = camera;
                                Tabuleiroplayer1.position.set(0,2,300);
                                createPlayer1Label();
                                document.body.removeChild(player2Div);
                                Tabuleiroplayer2.position.set(0,2,-300);
                                document.addEventListener('click', function(event){
                                    // Calcula a posição do clique do rato
                                    const rect = renderer.domElement.getBoundingClientRect();
                                    rato.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                                    rato.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                
                                    // Define a origem e direção do raio a partir do clique do rato
                                    raycaster.setFromCamera(rato, cameraAtiva);
                                    if(jogadorAtual == 1)
                                        {
                                            intersectsPlayer2 = raycaster.intersectObjects(Tabuleiroplayer2.children);
                                            if (intersectsPlayer2.length < 2) 
                                                {
                                                    CriarTorpedo();
                                                    animarTorpedo1(intersectsPlayer2[0].object);
                                                    jogadorAtual = 2;
                                                }
                                                else
                                                {
                                                    CriarTorpedo();
                                                    animarTorpedo1(intersectsPlayer2[0].object);
                                                    quadradoVermelho2 += 1;
                                                    jogadorAtual = 1;
                                                    Vencedor();
                                                }
                                        }
                                        else
                                        {
                                            intersectsPlayer1 = raycaster.intersectObjects(Tabuleiroplayer1.children);
                                            if (intersectsPlayer1.length < 2) 
                                                {
                                                    CriarTorpedo();
                                                    animarTorpedo2(intersectsPlayer1[0].object);
                                                    jogadorAtual = 1;
                                                }
                                                else
                                                {
                                                    CriarTorpedo();
                                                    animarTorpedo2(intersectsPlayer1[0].object);
                                                    quadradoVermelho1 += 1;
                                                    jogadorAtual = 2;
                                                    Vencedor();
                                                }
                                            }
                                });
                            }
                    }
                     else
                        {
                                console.log(barcosadcionados2.length);
                        }
            });   
        }
    }
});
}

//Função para criar tabuleiro Player 1
function TabuleiroPlayer1()
{
    var tamanho = 400;
    var divisoes = 10;
    Tabuleiroplayer1 = new THREE.GridHelper(tamanho, divisoes, 0xFFFFFF,0xFFFFFF);
    Tabuleiroplayer1.position.set(0,2,0);
    var tamanhoQuadrado = tamanho / divisoes;
    for (var i = 0; i < divisoes; i++) { //x
        for (var j = 0; j < divisoes; j++) { //z
            var posX = (i - divisoes / 2.22) * tamanhoQuadrado;
            var posZ = (j - divisoes / 2.22) * tamanhoQuadrado;
            var quadrado = new THREE.Mesh(
                new THREE.BoxGeometry(tamanhoQuadrado, 0.1, tamanhoQuadrado),
                new THREE.MeshLambertMaterial({ color: 0x808080 }) 
            );
            quadrado.position.set(posX, -2, posZ); 
            Tabuleiroplayer1.add(quadrado);
        }
    }
}

//Função para importar barcos Player 1
function barcosPlayer1()
{
    loader.load('./Objetos/Barco4/scene.gltf', function (gltf) {
        cena.add(gltf.scene);
        gltf.scene.scale.set(22, 1, 12);
        gltf.scene.position.set(500,1,-250);
        var controls = new TransformControls(cameraOrt, renderer.domElement);
        controls.attach(gltf.scene); 
        cena.add(controls);
        controls.setMode("translate");
        controls.addEventListener('dragging-changed', function (event) {
            if (!event.value) { // Quando o objeto é solto
                var posX = gltf.scene.position.x - Tabuleiroplayer1.position.x;
                var posZ = gltf.scene.position.z - Tabuleiroplayer1.position.z;
                if (Math.abs(posX) > 400 / 3 || Math.abs(posZ) > 400 / 2.1) 
                {
                    gltf.scene.position.set(500,1,-250);
                }
                else
                {
                    Tabuleiroplayer1.add(gltf.scene);
                    controls.detach(gltf.scene);
                    barcosadcionados1.push(gltf.scene);
                }
            } 
        });
        document.addEventListener('keydown', function (event) {
            // Enter
            if (event.keyCode == 13) {
                if(barcosadcionados1.length == 6)
                    {
                        gltf.scene.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                gltf.scene.position.y = -5;
                            }
                        });
                    
                    }
                    else{
                        console.log(barcosadcionados1.length);
                    }
            }
        });
    });
    loader.load('./Objetos/Barco4/scene.gltf', function (gltf) {
        cena.add(gltf.scene);
        gltf.scene.scale.set(22, 1, 12);
        gltf.scene.position.set(500,1,-300);
        var controls = new TransformControls(cameraOrt, renderer.domElement);
        controls.attach(gltf.scene); 
        cena.add(controls);
        controls.setMode("translate");
        controls.addEventListener('dragging-changed', function (event) {
            if (!event.value) { // Quando o objeto é solto
                var posX = gltf.scene.position.x - Tabuleiroplayer1.position.x;
                var posZ = gltf.scene.position.z - Tabuleiroplayer1.position.z;
                if (Math.abs(posX) > 400 / 3 || Math.abs(posZ) > 400 / 2.1) 
                {
                    // Se o objeto estiver fora do tabuleiro, volta para a posição inicial
                    gltf.scene.position.set(500,1,-300);
                }
                else
                {
                    Tabuleiroplayer1.add(gltf.scene);
                    controls.detach(gltf.scene);
                    barcosadcionados1.push(gltf.scene);
                }
            } 
        });
        document.addEventListener('keydown', function (event) {
            // Enter
            if (event.keyCode == 13) {
                if(barcosadcionados1.length == 6)
                    {
                        gltf.scene.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                gltf.scene.position.y = -5;
                            }
                        });
                    
                    }
                    else{
                        console.log(barcosadcionados1.length);
                    }
            }
        });
    })
    loader.load( './Objetos/Barco5/scene.gltf', function ( gltf ) {
        cena.add( gltf.scene);
        gltf.scene.position.set(650,-3,-250);
        gltf.scene.scale.set(0.065,0.03,0.035);
        var controls = new TransformControls(cameraOrt, renderer.domElement);
        controls.attach(gltf.scene);
        cena.add(controls);
        controls.setMode("translate"); 
        controls.addEventListener('dragging-changed', function (event) {
            if (!event.value) { // Quando o objeto é solto
                var posX = gltf.scene.position.x - Tabuleiroplayer1.position.x;
                var posZ = gltf.scene.position.z - Tabuleiroplayer1.position.z;
                if (Math.abs(posX) > 400 / 2.1 || Math.abs(posZ) > 400 / 3.2) {
                    // Se o objeto estiver fora do tabuleiro, volta para a posição inicial
                    gltf.scene.position.set(650,-3,-250);
                }
                else{
                    Tabuleiroplayer1.add(gltf.scene);
                    controls.detach(gltf.scene);
                    barcosadcionados1.push(gltf.scene);
                }
            }
        });
        document.addEventListener('keydown', function (event) {
            // Enter
            if (event.keyCode == 13) {
                if(barcosadcionados1.length == 6)
                    {
                        gltf.scene.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                gltf.scene.position.y = -15;
                            }
                        });
                    }
                    else{
                        console.log(barcosadcionados1.length);
                    }
            }
        });
    });
    loader.load( './Objetos/Barco2/scene.gltf', function ( gltf ) {
        cena.add( gltf.scene);
        gltf.scene.scale.set(6,1,6);
        gltf.scene.position.set(500,2,-100);
        var controls = new TransformControls(cameraOrt, renderer.domElement);
        controls.attach(gltf.scene);
        cena.add(controls);
        controls.setMode("translate"); 
        controls.addEventListener('dragging-changed', function (event) {
            if (!event.value) { // Quando o objeto é solto
                var posX = gltf.scene.position.x - Tabuleiroplayer1.position.x;
                var posZ = gltf.scene.position.z - Tabuleiroplayer1.position.z;
                if (Math.abs(posX) > 400 / 2.1 || Math.abs(posZ) > 400 / 2.2) {
                    // Se o objeto estiver fora do tabuleiro, volta para a posição inicial
                    gltf.scene.position.set(500,2,-100);
                }
                else
                {
                    Tabuleiroplayer1.add(gltf.scene);
                    controls.detach(gltf.scene);
                    barcosadcionados1.push(gltf.scene);
                }
            }
        });
        document.addEventListener('keydown', function (event) {
            // Enter
            if (event.keyCode == 13) {
                if(barcosadcionados1.length == 6)
                    {
                        gltf.scene.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                gltf.scene.position.y = -10;
                            }
                        });
                    }
                    else{
                        console.log(barcosadcionados1.length);
                    }
            }
        });
    });
    loader.load( './Objetos/Barco3/scene.gltf', function ( gltf ) {
        cena.add( gltf.scene);
        gltf.scene.scale.set(3,1,1.3);
        gltf.scene.position.set(500,-1,50);
        var controls = new TransformControls(cameraOrt, renderer.domElement);
        controls.attach(gltf.scene);
        cena.add(controls);
        controls.setMode("translate"); 
        controls.addEventListener('dragging-changed', function (event) {
            if (!event.value) { // Quando o objeto é solto
                var posX = gltf.scene.position.x - Tabuleiroplayer1.position.x;
                var posZ = gltf.scene.position.z - Tabuleiroplayer1.position.z;
                if (Math.abs(posX) > 400 / 2 || Math.abs(posZ) > 400 / 2.4) {
                    // Se o objeto estiver fora do tabuleiro, volta para a posição inicial
                    gltf.scene.position.set(500,-1,50);
                }
                else
                {
                    Tabuleiroplayer1.add(gltf.scene);
                    controls.detach(gltf.scene);
                    barcosadcionados1.push(gltf.scene);
                }
            }
        });
        document.addEventListener('keydown', function (event) {
            // Enter
            if (event.keyCode == 13) {
                if(barcosadcionados1.length == 6)
                    {
                        gltf.scene.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                gltf.scene.position.y = -12;
                            }
                        });
                    }
                    else{
                        console.log(barcosadcionados1.length);
                    }
            }
        });
    });
    loader.load( './Objetos/Barco3/scene.gltf', function ( gltf ) {
        cena.add( gltf.scene);
        gltf.scene.scale.set(3,1,1.3);
        gltf.scene.position.set(600,-1,50);
        var controls = new TransformControls(cameraOrt, renderer.domElement);
        controls.attach(gltf.scene);
        cena.add(controls);
        controls.setMode("translate"); 
        controls.addEventListener('dragging-changed', function (event) {
            if (!event.value) { // Quando o objeto é solto
                var posX = gltf.scene.position.x - Tabuleiroplayer1.position.x;
                var posZ = gltf.scene.position.z - Tabuleiroplayer1.position.z;
                if (Math.abs(posX) > 400 / 2 || Math.abs(posZ) > 400 / 2.4) {
                    // Se o objeto estiver fora do tabuleiro, volta para a posição inicial
                    gltf.scene.position.set(600,-1,50);
                }
                else
                {
                    Tabuleiroplayer1.add(gltf.scene);
                    controls.detach(gltf.scene);
                    barcosadcionados1.push(gltf.scene);
                }
            }
        });
        document.addEventListener('keydown', function (event) {
            // Enter
            if (event.keyCode == 13) {
                if(barcosadcionados1.length == 6)
                    {
                        gltf.scene.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                gltf.scene.position.y = -12;
                            }
                        });
                    }
                    else{
                        console.log(barcosadcionados1.length);
                    }
            }
        });
    });
}

//Função para criar o tabuleiro do Player 2
function TabuleiroPlayer2()
{        
    var tamanho = 400;
    var divisoes = 10;
    Tabuleiroplayer2 = new THREE.GridHelper(tamanho, divisoes, 0xFFFFFF,0xFFFFFF);
    Tabuleiroplayer2.position.y = 2;
    var tamanhoQuadrado = tamanho / divisoes;
    for (var i = 0; i < divisoes; i++) 
    {
        for (var j = 0; j < divisoes; j++)
        { 
            var posX = (i - divisoes / 2.22) * tamanhoQuadrado;
            var posZ = (j - divisoes / 2.22) * tamanhoQuadrado;
            var quadrado = new THREE.Mesh(
            new THREE.BoxGeometry(tamanhoQuadrado, 0.1, tamanhoQuadrado),
            new THREE.MeshLambertMaterial({ color: 0x808080 }) 
        );
        quadrado.position.set(posX, -2, posZ); 
        Tabuleiroplayer2.add(quadrado);
        }
    }
    cena.add(Tabuleiroplayer2);   
}

//Função para importar os barcos do Player 2 
function barcosPlayer2()
{
    loader.load('./Objetos/Barco4/scene.gltf', function (gltf) {
        cena.add(gltf.scene);
        gltf.scene.scale.set(22, 1, 12);
        gltf.scene.position.set(500,1,-250);
        var controls = new TransformControls(cameraOrt, renderer.domElement);
        controls.attach(gltf.scene);
        cena.add(controls);
        controls.setMode("translate");
        controls.addEventListener('dragging-changed', function (event) {
            if (!event.value) { // Quando o objeto é solto
                var posX = gltf.scene.position.x - Tabuleiroplayer2.position.x;
                var posZ = gltf.scene.position.z - Tabuleiroplayer2.position.z;
                if (Math.abs(posX) > 400 / 3 || Math.abs(posZ) > 400 / 2.2) {
                    gltf.scene.position.set(500,1,-250);
                }
                else{
                    Tabuleiroplayer2.add(gltf.scene);
                    controls.detach(gltf.scene);
                    barcosadcionados2.push(gltf.scene);
                }
            }
        });
        document.addEventListener('keydown', function (event) {
            if (event.keyCode == 32) {
                if(barcosadcionados2.length == 6)
                    {
                        gltf.scene.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                gltf.scene.position.y = -5;
                            }
                        });
                    }
                }
            });
        });
    loader.load('./Objetos/Barco4/scene.gltf', function (gltf) {
        cena.add(gltf.scene);
        gltf.scene.scale.set(22, 1, 12);
        gltf.scene.position.set(500,1,-300);
        var controls = new TransformControls(cameraOrt, renderer.domElement);
        controls.attach(gltf.scene);
        cena.add(controls);
        controls.setMode("translate");
        controls.addEventListener('dragging-changed', function (event) {
            if (!event.value) { // Quando o objeto é solto
                var posX = gltf.scene.position.x - Tabuleiroplayer2.position.x;
                var posZ = gltf.scene.position.z - Tabuleiroplayer2.position.z;
                if (Math.abs(posX) > 400 / 3 || Math.abs(posZ) > 400 / 2.2) {
                    gltf.scene.position.set(500,1,-300);
                }
                else{
                    Tabuleiroplayer2.add(gltf.scene);
                    controls.detach(gltf.scene);
                    barcosadcionados2.push(gltf.scene);
                }
            }
        });
        document.addEventListener('keydown', function (event) {
            if (event.keyCode == 32) {
                if(barcosadcionados2.length == 6)
                    {
                        gltf.scene.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                gltf.scene.position.y = -5;
                            }
                        });
                    }
                }
            });
        });
    
    loader.load( './Objetos/Barco5/scene.gltf', function ( gltf ) {
            cena.add( gltf.scene);
            gltf.scene.position.set(650,-3,-250);
            gltf.scene.scale.set(0.065,0.03,0.035);
            var controls = new TransformControls(cameraOrt, renderer.domElement);
            controls.attach(gltf.scene);
            cena.add(controls);
            controls.setMode("translate"); 
            controls.addEventListener('dragging-changed', function (event) {
                if (!event.value) { // Quando o objeto é solto
                    var posX = gltf.scene.position.x - Tabuleiroplayer2.position.x;
                    var posZ = gltf.scene.position.z - Tabuleiroplayer2.position.z;
                    if (Math.abs(posX) > 400 / 2.1 || Math.abs(posZ) > 400 / 3.2) {
                        gltf.scene.position.set(650,-3,-250);
                    }
                    else{
                        Tabuleiroplayer2.add(gltf.scene);
                        controls.detach(gltf.scene);
                        barcosadcionados2.push(gltf.scene);
                    }
            }
        });
        document.addEventListener('keydown', function (event) {
            if (event.keyCode == 32) 
            {
                if(barcosadcionados2.length == 6)
                    {
                        gltf.scene.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                gltf.scene.position.y = -15;
                            }
                        });
                    }
            }
        });
    });
    
    loader.load( './Objetos/Barco2/scene.gltf', function ( gltf ) {
        cena.add( gltf.scene);
        gltf.scene.scale.set(6,1,6);
        gltf.scene.position.set(500,2,-100);
        var controls = new TransformControls(cameraOrt, renderer.domElement);
        controls.attach(gltf.scene);
        cena.add(controls);
        controls.setMode("translate"); 
        controls.addEventListener('dragging-changed', function (event) {
            if (!event.value) { // Quando o objeto é solto
                var posX = gltf.scene.position.x - Tabuleiroplayer2.position.x;
                var posZ = gltf.scene.position.z - Tabuleiroplayer2.position.z;
                if (Math.abs(posX) > 400 / 2.1 || Math.abs(posZ) > 400 / 2.2) {
                    gltf.scene.position.set(500,2,-100);
                }
                else{
                    Tabuleiroplayer2.add(gltf.scene);
                    controls.detach(gltf.scene);
                    barcosadcionados2.push(gltf.scene);
                }
            }
        });
        document.addEventListener('keydown', function (event) {
            if (event.keyCode == 32) {
                if(barcosadcionados2.length == 6)
                    {
                        gltf.scene.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                gltf.scene.position.y = -6;
                            }
                        });
                    }
            }
        });
    });
    loader.load( './Objetos/Barco3/scene.gltf', function ( gltf ) {
        cena.add( gltf.scene);
        gltf.scene.scale.set(3,1,1.3);
        gltf.scene.position.set(500,-1,50);
        var controls = new TransformControls(cameraOrt, renderer.domElement);
        controls.attach(gltf.scene);
        cena.add(controls);
        controls.setMode("translate"); 
        controls.addEventListener('dragging-changed', function (event) {
            if (!event.value) { // Quando o objeto é solto
                var posX = gltf.scene.position.x - Tabuleiroplayer2.position.x;
                var posZ = gltf.scene.position.z - Tabuleiroplayer2.position.z;
                if (Math.abs(posX) > 400 / 2 || Math.abs(posZ) > 400 / 2.4) {
                    gltf.scene.position.set(500,-1,50);
                }
                else{
                    Tabuleiroplayer2.add(gltf.scene);
                    controls.detach(gltf.scene);
                    barcosadcionados2.push(gltf.scene);
                }
            }
        });
        document.addEventListener('keydown', function (event) {
            if (event.keyCode == 32) {
                if(barcosadcionados2.length == 6)
                    {
                        gltf.scene.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                gltf.scene.position.y = -12;
                            }
                        });
                    }
            }
        });
    });
    loader.load( './Objetos/Barco3/scene.gltf', function ( gltf ) {
        cena.add( gltf.scene);
        gltf.scene.scale.set(3,1,1.3);
        gltf.scene.position.set(600,-1,50);
        var controls = new TransformControls(cameraOrt, renderer.domElement);
        controls.attach(gltf.scene);
        cena.add(controls);
        controls.setMode("translate"); 
        controls.addEventListener('dragging-changed', function (event) {
            if (!event.value) { // Quando o objeto é solto
                var posX = gltf.scene.position.x - Tabuleiroplayer2.position.x;
                var posZ = gltf.scene.position.z - Tabuleiroplayer2.position.z;
                if (Math.abs(posX) > 400 / 2 || Math.abs(posZ) > 400 / 2.4) {
                    gltf.scene.position.set(600,-1,50);
                }
                else{
                    Tabuleiroplayer2.add(gltf.scene);
                    controls.detach(gltf.scene);
                    barcosadcionados2.push(gltf.scene);
                }
            }
        });
        document.addEventListener('keydown', function (event) {
            if (event.keyCode == 32) {
                if(barcosadcionados2.length == 6)
                    {
                        gltf.scene.traverse(function (child) {
                            if (child.isMesh) {
                                child.material.transparent = true;
                                child.material.opacity = 0;
                                gltf.scene.position.y = -12;
                            }
                        });
                    }
            }
        });
    });

}

//Função para animar o Torpedo Lançado pelo Player 1
function animarTorpedo1(target) {
    torpedo.position.set(target.position.x, 500, target.position.z - 400);
    torpedo.rotation.x = Math.PI;
    torpedo.visible = true;
    var velocidade = 20;
    function moverTorpedo(){
        torpedo.position.y -= velocidade;
        if (torpedo.position.y <= target.position.y) {
                torpedo.position.y = target.position.y;
                if(intersectsPlayer2.length < 2)
                    {
                        target.material.color.set(0x0000ff);
                        document.body.removeChild(player1Div);
                        CriarPlayer2Label();
                    }
                    else
                    {
                        target.material.color.set(0xff0000);
                    }
                cena.remove(torpedo);
                return;
            }
        requestAnimationFrame(moverTorpedo);

    }
    moverTorpedo(); // Inicia a animação
}
//Função para animar o Torpedo Lançado pelo Player 2
function animarTorpedo2(target) {
    torpedo.position.set(target.position.x, 500, target.position.z + 210);
    torpedo.rotation.x = Math.PI;
    torpedo.visible = true;
    var velocidade = 20;
    function moverTorpedo()
    {
        torpedo.position.y -= velocidade;
        if (torpedo.position.y <= target.position.y) {
            torpedo.position.y = target.position.y;
            if(intersectsPlayer1.length < 2)
                {
                    target.material.color.set(0x0000ff);
                    document.body.removeChild(player2Div);
                    createPlayer1Label();
                }
                else
                {
                    target.material.color.set(0xff0000);
                }
            cena.remove(torpedo);
            return;
        }
        requestAnimationFrame(moverTorpedo);
        }
    moverTorpedo(); // Inicia a animação
}
//Função para animar a Taça
function animarTaca() {
    taca.position.y = -100;
    movertaca();
    
}
//Função para mover a Taça
function movertaca() {
    var velocidade = 5; 
    if (taca.position.y < 300) {
        taca.position.y += velocidade;
        taca.rotation.x += 1;
        requestAnimationFrame(movertaca);
    } else 
    {
        taca.position.y = 300;
        taca.rotation.x += 1; 
        requestAnimationFrame(movertaca);
    }
    
}
//Função para criar Taça
function CriarTaca() {
    var points = [];
  
    for ( let i = 0; i < 10; i ++ ) {
      points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 2.5 + 0.8, ( i - 1 ) * 1.5 ) );
    }
    var geometriaLathe = new THREE.LatheGeometry( points,25 );


    var textura = new THREE.TextureLoader().load('./Imagens/dourado.jpg');    
    var materialLathe = new THREE.MeshStandardMaterial({map:textura});
  
    var meshLathe = new THREE.Mesh( geometriaLathe, materialLathe );
   
  
    var geometriaCilindro = new THREE.CylinderGeometry( 0.8, 0.8, 8,30 );
  
    var materialCilindro = new THREE.MeshStandardMaterial({map:textura}); 
  
    var meshCilindro = new THREE.Mesh( geometriaCilindro, materialCilindro );
    
  
    var geometriaCubo = new THREE.BoxGeometry( 5, 2, 5 ); 
    var materialCubo = new THREE.MeshLambertMaterial( {color: 'brown'} ); 
    var meshCubo = new THREE.Mesh( geometriaCubo, materialCubo ); 
    
  
    var geometriaTorus1 = new THREE.TorusGeometry( 4, 0.5, 60, 100, 2.8 );
  
  
    var materialTorus = new THREE.MeshStandardMaterial({map:textura}); 
  
    var meshTorus1 = new THREE.Mesh( geometriaTorus1, materialTorus );
    
  
    var geometriaTorus2 = new THREE.TorusGeometry( 4, 0.5, 60, 100, 2.8 ); 
  
    var meshTorus2 = new THREE.Mesh( geometriaTorus2, materialTorus );

  
    taca = new THREE.Group();
    
    taca.add(meshLathe);
    taca.add(meshCilindro);
    taca.add(meshCubo);
    taca.add(meshTorus1);
    taca.add(meshTorus2);

    meshCilindro.translateY(-4.0);

    meshCubo.translateY(-9.0);
    
    meshTorus1.translateY(7.0);
    meshTorus1.translateX(-1.3);
    meshTorus1.rotateZ(90); 

    meshTorus2.rotateZ(30);
    meshTorus2.translateZ(1.0)
    meshTorus2.translateY(1.5);
    meshTorus2.translateX(-6.0);

    taca.rotateY(Math.PI/2);
    taca.rotateX(250);
    taca.position.set(50,200,0);
    taca.scale.set(10,5,10);
    cena.add(taca);
}
//Funçao para criar Torpedo
function CriarTorpedo() {
    var geometriaCapsula = new THREE.CapsuleGeometry(1,4,10,20);
    
    var textura = new THREE.TextureLoader().load('./Imagens/metal.jpg');
    var materialCapsula = new THREE.MeshStandardMaterial({map:textura});
    
    var meshCapsula = new THREE.Mesh(geometriaCapsula, materialCapsula);
    meshCapsula.translateZ(-9.0);
    
    var geometriaCilindro = new THREE.CylinderGeometry(1.02,0.25,3.8,32);
    
    var materialCilindro = new THREE.MeshBasicMaterial( {color: 'black'} );
    
    var meshCilindro = new THREE.Mesh(geometriaCilindro, materialCilindro);
    meshCilindro.translateZ(-9.0);
    meshCilindro.translateY(-4.0);
    
    var geometriaPlano = new THREE.PlaneGeometry(1,2);
    var materialPlano = new THREE.MeshPhongMaterial({color: 'yellow', metalness: 1.0});
    
    
    var meshPlano = new THREE.Mesh(geometriaPlano, materialPlano);
    meshPlano.translateZ(-9.0);
    meshPlano.translateY(-6.8);
    
    var geometriaPlano2 = new THREE.PlaneGeometry(1,2);
    
    var meshPlano2 = new THREE.Mesh(geometriaPlano2, materialPlano);
    meshPlano2.translateZ(-9.0);
    meshPlano2.translateY(-6.8);
    meshPlano2.rotateY(30);
    
    torpedo = new THREE.Group();
    torpedo.add(meshCapsula);
    torpedo.add(meshCilindro);
    torpedo.add(meshPlano);
    torpedo.add(meshPlano2);
    torpedo.visible = false;
    torpedo.position.set(0,100,-450);
    torpedo.scale.set(10,15,10);
    cena.add(torpedo);
}
//Função para verificar quem é o vencedor 
function Vencedor()
{
    if (quadradoVermelho1 == 21) {
        CriarTaca();
        animarTaca();
        document.body.removeChild(player2Div);
        createVencedorLabel2();
    }
    else if(quadradoVermelho2 == 21)
    {
        CriarTaca();
        animarTaca();
        document.body.removeChild(player1Div);
        createVencedorLabel1();
        return;
    }
}
//Função para criar oceano
function CriarOceano() {

    //Define a resolução de pixel do renderer
    renderer.setPixelRatio( window.devicePixelRatio );
    //Tamanho do renderer
    renderer.setSize( window.innerWidth, window.innerHeight );

    //Alterar entre noite e dia 
    var noite = true;
    document.addEventListener('keydown', function (event) {
        // tecla N
        if (event.keyCode == 78) 
        { 
            if(noite)
                {
                    //Ativa o mapeamento tonal ACES
                    renderer.toneMapping = THREE.ACESFilmicToneMapping;
                    noite = false;
                }
                else
                {
                    //Desativa
                    renderer.toneMapping = 0;
                    noite = true;
                }   
        }
    });

    //geometria plana para representar a agua 
    var waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

    //cria  o objeto water
    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            //carrega as texturas
            waterNormals: new THREE.TextureLoader().load( './Imagens/oceano.jpg', function ( texture ) {
                //Repetiçaão da textura na horizontal e vertical (S e T)
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            } ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: cena.fog !== undefined //Ativa o nevoeiro se estiver definido
        }
    );

    water.rotation.x = - Math.PI / 2;

    cena.add( water );

    // SkyBox
    var sky = new Sky();
    sky.scale.setScalar( 10000 );
    cena.add( sky );

    var skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180
    };

    var pmremGenerator = new THREE.PMREMGenerator( renderer );
    var sceneEnv = new THREE.Scene();

    var renderTarget;
    function updateSun() {

        var phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        var theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        if ( renderTarget !== undefined ) renderTarget.dispose();

        sceneEnv.add( sky );
        renderTarget = pmremGenerator.fromScene( sceneEnv );
        cena.add( sky );

        cena.environment = renderTarget.texture;

    }

    updateSun();
    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    renderer.setSize( window.innerWidth, window.innerHeight );

}
//Função para animar o mar
function AnimacaoMar() {

    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    renderer.render( cena, cameraAtiva);

    requestAnimationFrame(AnimacaoMar);

}

//Função para criar o botão New Game e Atalhos
function createImportantButtons() {
    // Criar botão new game
    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'Novo Jogo';
    newGameButton.style.position = 'absolute';
    newGameButton.style.top = '20px';
    newGameButton.style.left = '20px';
    newGameButton.style.padding = '15px 25px'; // Adiciona padding ao botão
    newGameButton.style.backgroundColor = '#1c4456'; // Altera a cor de fundo do botão
    newGameButton.style.color = 'white'; // Altera a cor do texto do botão
    newGameButton.style.border = 'none'; // Remove a borda do botão
    newGameButton.style.borderRadius = '10px'; // Adiciona bordas arredondadas
    newGameButton.style.fontSize = '18px'; // Altera o tamanho da fonte
    newGameButton.style.fontWeight = 'bold'
    newGameButton.style.cursor = 'pointer'; // Altera o cursor ao passar sobre o botão
    newGameButton.addEventListener('click', startNewGame);
    document.body.appendChild(newGameButton);

     // Criar botão atalhos
     const shortcutsButton = document.createElement('button');
     shortcutsButton.textContent = 'Atalhos';
     shortcutsButton.style.position = 'absolute';
     shortcutsButton.style.top = '80px'; // Posiciona abaixo do botão "New Game"
     shortcutsButton.style.left = '20px';
     shortcutsButton.style.padding = '10px 20px'; // Adiciona padding ao botão
     shortcutsButton.style.backgroundColor = '#be927f'; // Altera a cor de fundo do botão
     shortcutsButton.style.color = 'white'; // Altera a cor do texto do botão
     shortcutsButton.style.border = 'none'; // Remove a borda do botão
     shortcutsButton.style.borderRadius = '10px'; // Adiciona bordas arredondadas
     shortcutsButton.style.fontSize = '18px'; // Altera o tamanho da fonte
     shortcutsButton.style.fontWeight = 'bold'
     shortcutsButton.style.cursor = 'pointer'; // Altera o cursor ao passar sobre o botão
     shortcutsButton.addEventListener('click', showShortcutsMenu);
     document.body.appendChild(shortcutsButton);

    // Criar botão de regras do joso
    const rulesButton = document.createElement('button');
    rulesButton.textContent = 'Regras do Jogo';
    rulesButton.style.position = 'absolute';
    rulesButton.style.bottom = '20px'; // Alterado para o canto inferior
    rulesButton.style.left = '20px'; // Alterado para o canto esquerdo
    rulesButton.style.padding = '15px 25px';
    rulesButton.style.backgroundColor = '#008080'; 
    rulesButton.style.color = 'white';
    rulesButton.style.border = 'none';
    rulesButton.style.borderRadius = '10px';
    rulesButton.style.fontSize = '18px';
    rulesButton.style.fontWeight = 'bold'
    rulesButton.style.cursor = 'pointer';
    rulesButton.addEventListener('click', openRules);
    document.body.appendChild(rulesButton);
     
}

//Funcao para criar a div do Player 1
function createPlayer1Label() {
    // Criar div para Player 1
    player1Div = document.createElement('div');
    player1Div.textContent = 'Player 1';
    player1Div.style.position = 'absolute';
    player1Div.style.top = '20px'; // Posicionado no topo
    player1Div.style.left = '50%';
    player1Div.style.transform = 'translateX(-50%)'; // Centraliza horizontalmente
    player1Div.style.padding = '15px 25px'; // Adiciona padding ao elemento
    player1Div.style.backgroundColor = '#008080'; // Altera a cor de fundo do elemento
    player1Div.style.color = 'white'; // Altera a cor do texto do elemento
    player1Div.style.border = 'none'; // Remove a borda do elemento
    player1Div.style.borderRadius = '10px'; // Adiciona bordas arredondadas
    player1Div.style.fontSize = '20px'; // Altera o tamanho da fonte
    player1Div.style.textAlign = 'center'; // Centraliza o texto
    player1Div.style.cursor = 'default'; // Cursor padrão
    player1Div.style.fontFamily = 'Impact'; // Altera a família da fonte
    document.body.appendChild(player1Div);
}

function createVencedorLabel1() {
    Vencedor1Div = document.createElement('div');
    Vencedor1Div.textContent = 'O vencedor foi o Player 1';
    Vencedor1Div.style.position = 'absolute';
    Vencedor1Div.style.top = '20px'; // Posicionado no topo
    Vencedor1Div.style.left = '50%';
    Vencedor1Div.style.transform = 'translateX(-50%)'; // Centraliza horizontalmente
    Vencedor1Div.style.padding = '15px 25px'; // Adiciona padding ao elemento
    Vencedor1Div.style.backgroundColor = '#008080'; // Altera a cor de fundo do elemento
    Vencedor1Div.style.color = 'white'; // Altera a cor do texto do elemento
    Vencedor1Div.style.border = 'none'; // Remove a borda do elemento
    Vencedor1Div.style.borderRadius = '10px'; // Adiciona bordas arredondadas
    Vencedor1Div.style.fontSize = '20px'; // Altera o tamanho da fonte
    Vencedor1Div.style.textAlign = 'center'; // Centraliza o texto
    Vencedor1Div.style.cursor = 'default'; // Cursor padrão
    Vencedor1Div.style.fontFamily = 'Impact'; // Altera a família da fonte
    document.body.appendChild(Vencedor1Div);
}

function createVencedorLabel2() {
    // Criar div para Player 1
    Vencedor2Div = document.createElement('div');
    Vencedor2Div.textContent = 'O vencedor foi o Player 2';
    Vencedor2Div.style.position = 'absolute';
    Vencedor2Div.style.top = '20px'; // Posicionado no topo
    Vencedor2Div.style.left = '50%';
    Vencedor2Div.style.transform = 'translateX(-50%)'; // Centraliza horizontalmente
    Vencedor2Div.style.padding = '15px 25px'; // Adiciona padding ao elemento
    Vencedor2Div.style.backgroundColor = '#008080'; // Altera a cor de fundo do elemento
    Vencedor2Div.style.color = 'white'; // Altera a cor do texto do elemento
    Vencedor2Div.style.border = 'none'; // Remove a borda do elemento
    Vencedor2Div.style.borderRadius = '10px'; // Adiciona bordas arredondadas
    Vencedor2Div.style.fontSize = '20px'; // Altera o tamanho da fonte
    Vencedor2Div.style.textAlign = 'center'; // Centraliza o texto
    Vencedor2Div.style.cursor = 'default'; // Cursor padrão
    Vencedor2Div.style.fontFamily = 'Impact'; // Altera a família da fonte
    document.body.appendChild(Vencedor2Div);
}

function CriarPlayer2Label()
{
    player2Div = document.createElement('div');
    player2Div.textContent = 'Player 2';
    player2Div.style.position = 'absolute';
    player2Div.style.top = '20px'; // Posicionado no topo
    player2Div.style.left = '50%';
    player2Div.style.transform = 'translateX(-50%)'; // Centraliza horizontalmente
    player2Div.style.padding = '15px 25px'; // Adiciona padding ao elemento
    player2Div.style.backgroundColor = '#008080'; // Altera a cor de fundo do elemento
    player2Div.style.color = 'white'; // Altera a cor do texto do elemento
    player2Div.style.border = 'none'; // Remove a borda do elemento
    player2Div.style.borderRadius = '10px'; // Adiciona bordas arredondadas
    player2Div.style.fontSize = '20px'; // Altera o tamanho da fonte
    player2Div.style.textAlign = 'center'; // Centraliza o texto
    player2Div.style.cursor = 'default'; // Cursor padrão
    player2Div.style.fontFamily = 'Impact'; // Altera a família da fonte
    document.body.appendChild(player2Div);
}

//Função para abrir a página com as regras
function openRules() {
    alert("Regras do jogo Batalha Naval:\n1.º Inicialmente o Jogador 1 coloca os seus navios no tabuleiro de acordo com a disposição pretendida e no final desta tarefa clica na tecla de confirmação Enter\n2.º O Jogador 2 realiza a mesma tarefa de acordo com a sua preferência, no entanto desta vez clica na tecla de confirmação Space\n3.º O Jogador 1 começa a fase de ataques sobre o tabuleiro da direita (através do left click do rato), onde caso acerte no local onde se encontre um navio adversário, esse local ficará com a cor vermelho e o jogador tem direito a jogar novamente, e assim sucessivamente até que acerte num local onde não haja nenhum navio\n4.º O Jogador 2 inicia a sua fase de ataques, onde o processo funciona de igual forma como no passo anterior, mas desta vez os ataques são sobre o tabuleiro da esquerda\n5.º O 3.º e 4.º passos ocorrem repetidas vezes, até que todos os navios de um dos Jogadores estejam todos destruídos e surja a taça para o vencedor.");
}

//Função para exibir o menu de atalhos
function showShortcutsMenu() {
    alert("Tecla M - Ligar/Desligar AmbientLight\nTecla L - Ligar/Desligar SpotLight\nTecla N - Colocar Ocenano mais escuro/claro\nTecla Enter - Acabar o turno de posicionamento dos navios do Player 1\nTecla Espaço -  Acabar o turno de posicionamento dos navios do Player 2");
}

//Função para iniciar um novo jogo
function startNewGame() {
    const confirmation = confirm("Tem a certeza que deseja iniciar um novo jogo?");
    if (confirmation) {
        window.location.reload(); // Recarrega a página para reiniciar o jogo
}}

Start();