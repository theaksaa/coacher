let canvas = null, video = null, poseNet = null, pose = null, skeleton = null;

function setup() {
    canvas = createCanvas(320, 240);
    canvas.parent('canvas');

    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();
    document.getElementById('status').innerHTML = 'Model Loading...';

    poseNet = ml5.poseNet(video, function() {
        document.getElementById('status').innerHTML = 'Model Loaded';
    });
    poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
    if(poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    } else {
        pose = null;
        skeleton = null;
    }
}


function draw() {
    image(video, 0, 0);

    if(pose) {
        StartExercise();
        DrawKeyPoints();
        DrawSkeleton();
    } else {
        clear();
        image(video, 0, 0);
    }
}

function DrawKeyPoints() {
    for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        if(pose.keypoints[i].score >= 0.75) fill(0, 255, 0);
        else fill(255, 0, 0);
        strokeWeight(0);
        ellipse(x, y, 8, 8);            
    }
}

function DrawSkeleton() {
    for (let j = 0; j < skeleton.length; j++) {
        let partA = skeleton[j][0];
        let partB = skeleton[j][1];
        stroke(255);
        strokeWeight(1);
        line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
}




// Exercise 1


let state = false;
let exerciseCount = 0;

function StartExercise() {
    let angle = calculateAngle(pose.rightWrist, pose.rightElbow, pose.rightShoulder).toFixed(2);
    //document.getElementById('nose').innerHTML = 'X: ' + pose.nose.x.toFixed(2) + ' Y: ' + pose.nose.y.toFixed(2);
    //document.getElementById('angle').innerHTML = 'Right arm ANGLE: ' + angle + '○';

    if(Math.abs(180 - angle) <= 20 && state == false) {
        state = true;
        document.getElementById('status').innerHTML = 'Exercise started!';
    }
    else if(Math.abs(90 - angle) <= 20 && state == true) {
        state = false;
        document.getElementById('status').innerHTML = 'Exercise done!';
        document.getElementById('exerciseCount').innerHTML = ++exerciseCount;
    }
}

function calculateAngle(A, B, C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))*(180/Math.PI);
}
