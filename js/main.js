(function() {
    var video1 = document.querySelector("#video1 video"),
        video2 = document.querySelector("#video2 video"),
        video3 = document.querySelector("#video3 video"),
        video4 = document.querySelector("#video4 video");

    var button1 = document.querySelector("#video1 button"),
        button2 = document.querySelector("#video2 button"),
        button3 = document.querySelector("#video3 button"),
        button4 = document.querySelector("#video4 button");

    var recorder; // globally accessible


    button1.addEventListener("click", function() {
      record(video1);
      this.classList.add("hidden");
    });

    button2.addEventListener("click", function() {
      record(video2);
      this.classList.add("hidden");
    });

    button3.addEventListener("click", function() {
      record(video3);
      this.classList.add("hidden");
    });

    button4.addEventListener("click", function() {
      record(video4);
      this.classList.add("hidden");
    });




    function record(video) {
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
            });
          }, 2000);
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
})();
