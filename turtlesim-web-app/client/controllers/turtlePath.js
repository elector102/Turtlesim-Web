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
var oldPosX;
var oldPosY


// Draw variables
var trianguloPosicionX = 0;
var trianguloPosicionY = 0;
var cuadrado;
var triangulo, line, material;
var escena;
var camara;
var render;

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
        pos = changeCordenates(pos);
        drawPath(pos);
        animarEscena(pos);

    }
});


changeCordenates = function (message) {
    message.x = (message.x - 5.54) / 2;
    message.y = (message.y - 5.54) / 2; // coordinates for y are reversed
    message.t = message.t - 3.1415 / 2;
    return(message);

}
// draws in the canvas, according to turtlesim position
var materialLine, geometry, vertices, line;
drawPath = function (message) {
    //camino
    if ((message.x != oldPosX) && (message.y != oldPosY)) {

        vertices = geometry.vertices;
        //last = vertices[ vertices.length - 1 ];
        vertices.push(
                new THREE.Vector3(
                        message.x,
                        message.y,
                        -7)

                );

        geometry = new THREE.Geometry();
        geometry.vertices = vertices;

        escena.remove(line);
        line = new THREE.Line(geometry, materialLine)
        escena.add(line);

        oldPosX = message.x;
        oldPosY = message.y;
    }


}

function renderEscena() {
    render.render(escena, camara);

}
animarEscena = function (message) {

    trianguloPosicionX = message.x;
    trianguloPosicionY = message.y;
    triangulo.rotation.z = message.t;
    triangulo.position.set(trianguloPosicionX, trianguloPosicionY, -7.0);
    renderEscena();

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
    escena = new THREE.Scene();

    //Camara
    camara = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 100);
    camara.position.set(0, 0, 0);
    camara.lookAt(escena.position);
    escena.add(camara);

    //Material
    var material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    });

    //Triángulo
    var trianguloGeometria = new THREE.Geometry();
    trianguloGeometria.vertices.push(new THREE.Vector3(0.0, 0.15, 0.0));
    trianguloGeometria.vertices.push(new THREE.Vector3(-0.10, -0.10, 0.0));
    trianguloGeometria.vertices.push(new THREE.Vector3(0.10, -0.10, 0.0));
    trianguloGeometria.faces.push(new THREE.Face3(0, 1, 2));

    triangulo = new THREE.Mesh(trianguloGeometria, material);
    triangulo.position.set(0.0, 0.0, -7.0);
    escena.add(triangulo);
    
    
    // linea
    
    materialLine = new THREE.LineBasicMaterial({color: 0x0077ff});
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    line = new THREE.Line(geometry, materialLine)
    escena.add(line);
}

function webGLStart() {
    iniciarEscena();
}

Template.three.rendered = function () {

    webGLStart();

}
