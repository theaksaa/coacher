let canvas = null, video = null, poseNet = null, pose = null, skeleton = null, isActive = false;
let timeStarted = null;

function setup() {
    canvas = createCanvas(320, 240);
    canvas.parent('canvas');

    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();
}

function start(again) {
    document.getElementById('startExercise').innerHTML = 'Stop exercise';

    if(!again) {
        var x = document.getElementById('exercisePanel');
        if (x.style.display === 'none') x.style.display = 'block';
        else x.style.display = 'none';
    
        document.getElementById('status').innerHTML = 'Loading Exercise...';
    
        poseNet = ml5.poseNet(video, function() {
            document.getElementById('status').innerHTML = 'Exercise loaded !';
        });
        poseNet.on('pose', gotPoses);
    }
    else document.getElementById('status').innerHTML = 'Exercise loaded !';

    document.getElementById('exerciseCount').innerHTML = 0;
    document.getElementById('exerciseRepetitions').innerHTML = exerciseRepetitions;
    isActive = true;
    ResetVariables();
}

function Finish() {
    let timeElapsed = (Date.now() - timeStarted) / (1000 * 60);
    document.getElementById('status').innerHTML = 'Exercise finished! Elapsed:' + (timeElapsed < 1 ? ((timeElapsed * 60).toFixed(2) + 's') : timeElapsed.toFixed(2) + 'min');
    document.getElementById('startExercise').innerHTML = 'Start exercise';
    isActive = false;

    $.ajax({
        url: '/exercise/finish/?id=' + exerciseID,
        type: 'POST',
        cache: false,
        data: { 
            timeStarted: timeStarted,
            timeElapsed: timeElapsed
        }, 
        success: function(data){
            if (data.redirect) window.location.href = data.redirect;
            else {
                $('#modal').modal();
                $('#modalTitle').html('Error');
                $('#modalText').html(JSON.parse(jqXHR.responseText).message);
                console.log(jqXHR.responseText);
            }
        },
        error: function(jqXHR, textStatus, err) {
            $('#modal').modal();
            $('#modalTitle').html('Error');
            $('#modalText').html(JSON.parse(jqXHR.responseText).message);
        }
    });

    ResetVariables();
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

    if(pose && isActive) {
        Exercise();
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
let exerciseRepetitions = 5;

function Exercise() {
    let angle = calculateAngle(pose.rightWrist, pose.rightElbow, pose.rightShoulder).toFixed(2);

    if(Math.abs(180 - angle) <= 20 && state == false) {
        state = true;
        document.getElementById('status').innerHTML = 'Move your arm up !';
    }
    else if(Math.abs(90 - angle) <= 20 && state == true) {
        state = false;
        document.getElementById('status').innerHTML = 'Go back!';
        document.getElementById('exerciseCount').innerHTML = ++exerciseCount;
    }
}

function ResetVariables() {
    state = false;
    exerciseCount = 0;
    timeStarted = null;
    timeFinished = null;
}

function calculateAngle(A, B, C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))*(180/Math.PI);
}

$('#startExercise').click(function(event) {
    console.log('ee');
    event.preventDefault();
    if(!isActive && poseNet === null) start();
    else if(!isActive && poseNet !== null) start(true);
    else {
        isActive = false;
        ResetVariables();
        document.getElementById('status').innerHTML = 'Exercise stopped';
        document.getElementById('startExercise').innerHTML = 'Start exercise';
    }
});