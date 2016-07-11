/*
 * Turtle path canvas controller
 */

// position variables

var pos = {
    x: 0,
    y: 0,
    z: 0,
    li: 0,
    av: 0,
    t: 0
};


// Scene variables
var scene, camara, render;
var oldPosX;
var oldPosY;

// Draw variables
var trianguloPositionX = 0;
var trianguloPositionY = 0;
var triangulo, line, material;

var materialLine, geometry, vertices;

// Start WebGL
Template.three.rendered = function () {

    iniciarEscena();

}

function iniciarEscena() {
    //Render
    render = new THREE.WebGLRenderer();

    render.setClearColor(0xF50000, 1);

    var canvasWidth = 500;
    var canvasHeight = 500;
    render.setSize(canvasWidth, canvasHeight);

    document.getElementById("canvas").appendChild(render.domElement);

    //Escena
    scene = new THREE.Scene();

    //Camara
    camara = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 100);
    camara.position.set(0, 0, 0);
    camara.lookAt(scene.position);
    scene.add(camara);

    // Material
    var material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    });

    // Triángulo
    var trianguloGeometria = new THREE.Geometry();
    trianguloGeometria.vertices.push(new THREE.Vector3(0.0, 0.15, 0.0));
    trianguloGeometria.vertices.push(new THREE.Vector3(-0.10, -0.10, 0.0));
    trianguloGeometria.vertices.push(new THREE.Vector3(0.10, -0.10, 0.0));
    trianguloGeometria.faces.push(new THREE.Face3(0, 1, 2));

    triangulo = new THREE.Mesh(trianguloGeometria, material);
    triangulo.position.set(0.0, 0.0, -7.0);
    scene.add(triangulo);

    // linea

    materialLine = new THREE.LineBasicMaterial({color: 0x0077ff});
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    line = new THREE.Line(geometry, materialLine)
    scene.add(line);
}

// subscription to turtle_pose topic
turtle_pose.subscribe(function (message) {
    // only draws if the control vector of turtlesim has changed
    if (message.x != pos.x || message.y != pos.y || message.z != pos.z || message.theta != pos.t ||
            message.linear_velocity != pos.li || message.angular_velocity != pos.av) {
        pos.x = message.x;
        pos.y = message.y;
        pos.z = message.z;
        pos.t = message.theta;
        pos.li = message.linear_velocity;
        pos.av = message.angular_velocity;
        //*** Function
        pos = changeCordenates(pos);
        
        drawPath(pos);
        
        animateScene(pos);

    }
});

// Change the TurtleSim cordenates at scene cordenates  
changeCordenates = function (message) {
    message.x = (message.x - 5.54) / 2;
    message.y = (message.y - 5.54) / 2;
    message.t = message.t - 3.1415 / 2;
    return(message);

}

// draws in the render, according to turtlesim position
drawPath = function (message) {
    //camino
    if ((message.x != oldPosX) && (message.y != oldPosY)) {

        vertices = geometry.vertices;
        vertices.push(
                new THREE.Vector3(
                        message.x,
                        message.y,
                        -7)

                );

        geometry = new THREE.Geometry();
        geometry.vertices = vertices;

        scene.remove(line);
        line = new THREE.Line(geometry, materialLine)
        scene.add(line);

        oldPosX = message.x;
        oldPosY = message.y;
    }


}

function renderScene() {
    render.render(scene, camara);
}

// Turtlebot Animation
animateScene = function (message) {
    trianguloPositionX = message.x;
    trianguloPositionY = message.y;
    triangulo.rotation.z = message.t;
    triangulo.position.set(trianguloPositionX, trianguloPositionY, -7.0);
    renderScene();

}