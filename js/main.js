(function() {
  var video1 = document.querySelector("#video1 video"),
      video2 = document.querySelector("#video2 video"),
      video3 = document.querySelector("#video3 video"),
      video4 = document.querySelector("#video4 video");

  var button1 = document.querySelector("#video1 button"),
      button2 = document.querySelector("#video2 button"),
      button3 = document.querySelector("#video3 button"),
      button4 = document.querySelector("#video4 button");

  var count1 = document.querySelector("#video1 .video-tempo"),
      count2 = document.querySelector("#video2 .video-tempo"),
      count3 = document.querySelector("#video3 .video-tempo"),
      count4 = document.querySelector("#video4 .video-tempo");

  var pulse1 = document.querySelector("#video1 .video-pulse"),
      pulse2 = document.querySelector("#video2 .video-pulse"),
      pulse3 = document.querySelector("#video3 .video-pulse"),
      pulse4 = document.querySelector("#video4 .video-pulse");

  var tempo = 100,
      beatPos = 1,
      beatPlaying = false,
      countPos = 4,
      counting = false,
      countVideo = null,
      countCount = null,
      countPulse = null;

  var exportButton = document.querySelector("#header-export");


  /*
   * Event Listeners
   */


  button1.addEventListener("click", function() {
    record(video1, count1, pulse1);
    this.classList.add("hidden");
  });

  button2.addEventListener("click", function() {
    record(video2, count2, pulse2);
    this.classList.add("hidden");
  });

  button3.addEventListener("click", function() {
    record(video3, count3, pulse3);
    this.classList.add("hidden");
  });

  button4.addEventListener("click", function() {
    record(video4, count4, pulse4);
    this.classList.add("hidden");
  });

  exportButton.addEventListener("click", function() {
    var file = new File([video1.src], "test1.mp4", {type: "video/mp4"});
    FileSaver.saveAs(file);
  });


  /*
   * Video recording
   */

  var recorder;

  function record(video, count, pulse) {
    // Ask for permission upfront
    var promise = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });

    startCount(video, count, pulse);
    if(!beatPlaying) startBeat();
  }

  function startCapturing(video) {
    captureCamera(function(camera) {
        setSrcObject(camera, video);
        video.play();

        var options = {
          mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
        };

        recorder = RecordRTC(camera, options);

        recorder.startRecording();

        // release camera on stopRecording
        recorder.camera = camera;

        setTimeout(function() {
          recorder.stopRecording(function() {
            stopRecordingCallback(video);
            countPulse.classList.remove("visible");
            countPulse = null;
          });
        }, 8*1000*60/tempo);
    });
  }

  function captureCamera(callback) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(camera) {
        callback(camera);
    }).catch(function(error) {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
    });
  }

  function stopRecordingCallback(video) {
    video.src = video.srcObject = null;
    video.src = URL.createObjectURL(recorder.getBlob());
    video.removeAttribute("muted")
    video.volume = 1;
    video.muted = false;
    video.play();
    recorder.camera.stop();
    recorder.destroy();
    recorder = null;
  }

  /*
   * Beat
   */


   function startBeat() {
     if(!beatPlaying) {
       beat();
       setInterval(beat, 1000*60/tempo);
       beatPlaying = true;
     }
   }

   function stopBeat() {
     clearInterval(beat);
     beatPlaying = false;
   }

   function startCount(video, count, pulse) {
     counting = true;
     countVideo = video;
     countCount = count;
     countPulse = pulse;
     pulse.style.animationDuration = 1000*60/tempo + "ms";
     pulse.classList.add("visible");
     count.classList.add("visible");
   }

   function beat() {
     //console.log(beatPos);
     beatPos++;
     if(beatPos == 5) beatPos = 1;

     if(counting) {
       if(countPos == 0) {
         startCapturing(countVideo);
         countCount.classList.remove("visible");
         counting = false;
         countPos = 4;
         countCount = null;
         countVideo = null;
         return;
       }
       countCount.innerHTML = countPos;
       countPos--;
     }
  }

})();
