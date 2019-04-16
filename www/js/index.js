
var app = {
    canvas: null,
    init: function () {
        if (window.hasOwnProperty("cordova")) {
            document.addEventListener("deviceready", app.ready, false);
        } else {
            document.addEventListener("DOMContentLoaded", app.ready); 
        }
    },


    ready: function () { 
        let input = document.getElementById('makeVD');
        input.addEventListener("click", app.makeVideo);

        let galleryBtn = document.querySelector("#goToList");
        galleryBtn.addEventListener("click", app.goToGallery);

        let addBtn = document.querySelector("#goToHome");
        addBtn.addEventListener("click", app.goToHomepg);

        let video = document.getElementById('video');
        
        video.addEventListener("canplay", function(ev){
            console.log('canplay', ev.target.videoWidth, ev.target.videoHeight);
            console.log(ev.target.clientWidth, ev.target.clientHeight);
            console.log(ev.target.currentSrc, ev.target.duration, ev.target.currentTime);
        });
     
        video.addEventListener('canplaythrough', function(ev){
            video.play();
            app.makeImg(ev);
            console.log(ev.target.currentSrc, ev.target.duration, ev.target.currentTime);
        });
    },


    makeVideo: function () {
          let opts = { limit: 1, duration: 10, quality: 1 };
          navigator.device.capture.captureVideo(app.success, app.fail, opts);
    },


    success: function (mediaFiles) {
       console.log(mediaFiles.length)
        let path, len;
        for (let i = 0, len = mediaFiles.length; i < len; i++) {
             let video = document.getElementById('video');
             let video2 = document.getElementById('video2');
             path = mediaFiles[i].fullPath;
             video.src = path;  
             video2.src = path;
        }  
      },
      
     
     fail: function (err) {
        console.log("Capture Error:", err.code, err.message);
      },


    makeImg: function(ev){

        console.log("wowwww")
        let dur = ev.target.duration;
        let sw = 200;//ev.target.naturalWidth;
        let sh = 200;//ev.target.naturalHeight * (1 / 2);

       // let dx = 0;
       // let dy = 0;

        console.log(dur/4);
                app.canvas = document.querySelector("#canvas");
                let ctx = app.canvas.getContext('2d');

                app.canvas.width = 400;//video.videoWidth;
                app.canvas.height =400; // video.videoHeight;

                let dw = (app.canvas.width/2);
                let dh = (app.canvas.height/2);

                video.currentTime = 0;
                //ctx.drawImage(video, 0, 0, sw, sh, 0, 0, dw, dh)
                setTimeout(function(){
                    ctx.drawImage(video, 0, 0, sw, sh, 0, 0, dw, dh);
                    video.currentTime = (dur/4);

                    setTimeout(function(){
                        ctx.drawImage(video, 0, 0, sw, sh, 200 , 0, dw, dh);
                        video.currentTime = (dur/3); 
 
                        setTimeout(function(){
                            ctx.drawImage(video, 0, 0, sw, sh, 0, 200, dw, dh);
                            video.currentTime = (dur/2); 

                        setTimeout(function(){
                            ctx.drawImage(video, 0, 0, sw, sh, 200, 200, dw, dh);
                            video.currentTime = dur; 
     
                        },500)

                        },500)

                    },500)

                },500)
                

                app.canvas.addEventListener('click', app.storeFile);  
   },


   storeFile: function(ev){
       
    console.log("Es una prueba" + ev);
    alert("Your thumb image have been saved");

    window.requestFileSystem( LocalFileSystem.PERSISTENT, 0, function(successF){

        app.root = successF.root;
        app.canvas.toBlob(app.myBlob, 'image/png');
    },
    
    function(errF){
        console.log(errF)
    })
   },


   myBlob: function(blob){
       
    let dirEntry = app.root;

    dirEntry.getFile(
        "SavedLogo.png", 
    { create: true, 
    exclusive: false},
    function(fileEntry){
        console.log("Natalia Successed")
        fileEntry.createWriter(function(fileWriter){
            fileWriter.onwriteend = function(){
                app.readBinaryFile(fileEntry);
            };
            fileWriter.onerror = function(e) {
                console.log(e.toString());
            };
            fileWriter.write(blob);
        });
    }, app.fileError
    );
   },
   

   readBinaryFile: (fileEntry) => {
    //read the file that was saved
    fileEntry.file(function (file) {
        //get the file from the fileEntry Object
        console.log(file); //file has localURL property for cdvfile: version
        console.log(fileEntry);

        let video2 = document.getElementById('video2');
        video2.poster = file.localURL;
    
        let img = document.createElement("img");
        img.src = file.localURL;
        img.classList.add("imgList")
        let li = document.createElement('li');
        li.appendChild(img);
        document.querySelector('.thumbList').appendChild(li);

    }, app.fileError);
},


fileError: (err) => {
    console.warn(err);
},

 goToGallery: function() {
   let home = document.querySelector("#home-record");
    home.classList.remove("active");

    let gallery = document.querySelector("#modify-page");
    gallery.classList.add("active");
},

goToHomepg: function(){
    let gallery = document.querySelector("#modify-page");
    gallery.classList.remove("active");

    let home = document.querySelector("#home-record");
    home.classList.add("active");
}

};
app.init();