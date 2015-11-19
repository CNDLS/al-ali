
Game.Scene.new(Game.Scene.Basic, "Recorder", {
  
  finalize: function (round) {
    var scene = this;
    scene.volume_level = 0;
    
    
    function handleWAV(blob) {
      var url = URL.createObjectURL(blob);
      console.log(url);
    }
    
    this.toggle.click(function () {
      if ($(this).attr('action') === "start") {
        scene.recorder && scene.recorder.record();
        $(this).attr('action', 'stop').html('Stop');
      } else {
        scene.recorder && scene.recorder.stop();
        debugger;
        scene.recorder && scene.recorder.exportWAV(handleWAV.bind(this));
        $(this).attr('action', 'start').html('Record');
      }
    })
    
    this.volume_slider.on('change', function () {
      scene.volume_level = this.value;
      scene.volume.gain.value = this.value;
    });
    
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      window.URL = window.URL || window.webkitURL || window.mozURL;
    
      audio_context = new AudioContext();
      console.log('Audio context set up.');
      console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
      console.warn('No web audio support in this browser!');
    }
  
    navigator.getUserMedia(
      {audio: true}, 
      function (stream) {
        var input = audio_context.createMediaStreamSource(stream);
         console.log('Media stream created.');

         scene.volume = audio_context.createGain();
         scene.volume.gain.value = scene.volume_level;
         input.connect(scene.volume);
         scene.volume.connect(audio_context.destination);
         console.log('Input connected to audio context destination.');
  
         scene.recorder = new Recorder(input);
         console.log('Recorder initialised.');
      },
      function(e) {
        console.warn('No live audio input: ' + e);
      });
  }
});