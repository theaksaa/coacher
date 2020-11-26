let video;
let poseNet;
let pose;

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
    if(poses.length > 0) {
        pose = poses[0].pose;
    }
}

function keyPressed() {
    if(key == 's') {
        console.log('s');
        state = true;
        state_val = pose.nose.x;
    }
}

function modelLoaded() {
    console.log('poseNet ready');
}



function calculateAngle(A, B, C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))*(180/Math.PI);
}

function draw() {
    image(video, 0, 0);

    if(pose) {
        document.getElementById("nose").innerHTML = "X: " + pose.nose.x.toFixed(2) + "\nY: " + pose.nose.y.toFixed(2);
        document.getElementById("angle").innerHTML = "ANGLE: " + calculateAngle(pose.rightWrist, pose.rightElbow, pose.rightShoulder).toFixed(2) + "○";

        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            if(pose.keypoints[i].score >= 0.75) fill(0, 255, 0);
            else fill(255, 0, 0);
            ellipse(x, y, 16, 16);
        }
    }
}