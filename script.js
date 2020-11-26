let canvas;
let video;

let poseNet;
let pose;

let state = false;

function setup() {
    canvas = createCanvas(640, 480);
    canvas.parent("canvas");

    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, function() {
        console.log('model loaded');
    });
    poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
    if(poses.length > 0) {
        pose = poses[0].pose;
    } else pose = null;
}

function startExercise(angle) {
    if(Math.abs(180 - angle) <= 20 && state == false) {
        state = true;
        console.log('exercise started!');
    }
    else if(Math.abs(90 - angle) <= 20 && state == true) {
        state = false;
        console.log('exercise done!');
    }
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
        let angle = calculateAngle(pose.rightWrist, pose.rightElbow, pose.rightShoulder).toFixed(2);
        document.getElementById("nose").innerHTML = "X: " + pose.nose.x.toFixed(2) + "\nY: " + pose.nose.y.toFixed(2);
        document.getElementById("angle").innerHTML = "Right arm ANGLE: " + angle + "○";
        startExercise(angle);

        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            if(pose.keypoints[i].score >= 0.75) fill(0, 255, 0);
            else fill(255, 0, 0);
            ellipse(x, y, 16, 16);
        }
    } else {
        clear();
        image(video, 0, 0);
    }
}