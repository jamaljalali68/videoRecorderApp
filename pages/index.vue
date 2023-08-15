<template>
    <div class="container">
        <div class="row d-flex ">
            <div class="col-9 box d-flex flex-column justify-content-center">
                <h2>Camera Recording App</h2>
                <video id="video" width="100%" height="500" autoplay></video>
                <span v-if="counterTextShow" class="counterDown">Your Record Finnished after {{ time }} second Or Press
                    Stop</span>
                <div id="buttons" class="p-4">
                    <button class="record customBtn">Record</button>
                    <button class="stop customBtn">Stop</button>
                </div>
                <div class="d-flex justify-content-center">
                    <canvas class="visualizer" height="60px" style=";"></canvas>
                </div>
            </div>
            <div class="col-3 p-2 box">
                <h2>Recorded Videos</h2>
                <div class="video-clip d-flex flex-column">
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup >
import Swal from 'sweetalert';
import { useToast } from "vue-toastification";
const toast = useToast()

const time = ref(0)
const counterTextShow = ref(false);

onMounted(async () => {
    const record = document.querySelector('.record');
    const stop = document.querySelector('.stop');
    const video = document.querySelector("#video");

    stop.disabled = true;
    if (navigator.mediaDevices.getUserMedia) {
        const constraints = { video: true, audio: true };
        let chunks = [];
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                visualize();
                video.srcObject = stream;
                record.onclick = function () {
                    counterTextShow.value = true;
                    time.value = 30;
                    mediaRecorder.start();
                    var timout = setInterval(() => {
                        if (time.value == 0) {
                            stop.click();
                            counterTextShow.value = false;
                            timout.clearInterval();
                        }
                        time.value--;
                    }, 1000)
                    record.style.background = "red";

                    stop.disabled = false;
                    record.disabled = true;
                }
                stop.onclick = function () {
                    counterTextShow.value = false;
                    mediaRecorder.stop();
                    record.style.background = "";
                    record.style.color = "";
                    stop.disabled = true;
                    record.disabled = false;
                }
                mediaRecorder.onstop = function (e) {

                    swal({
                        title: "your record completed successfully to save it and send request to server press YES",
                        buttons: true,
                        buttons: ["NO", "YES"],
                        icon: "warning",
                        dangerMode: true,
                    })
                        .then(async(yes) => {
                            if (yes) {
                                const blob = new Blob(chunks, { mimeType: 'video/mp4' });
                                chunks = [];
                                const videoURL = window.URL.createObjectURL(blob);
                                createVideoClip(videoURL);

                                const data = await $fetch('https://jsonplaceholder.typicode.com/posts/1');
                                toast.success(`response from server is : ${data}......response title is : ${data.title}`)
                                console.log(data)
                            }
                        }
                        );

                }
                mediaRecorder.ondataavailable = function (e) {
                    chunks.push(e.data);
                }
            })
            .catch((error) => {
                toast.error(error)

            })
    }
}
)
</script>

<style scoped>
.box {
    box-shadow: -1px 2px 9px -3px #000000bf
}

.customBtn {
    border-radius: 10px;
}

.counterDown {
    text-align: center;
    font-size: 25px;
}
</style>
  
  
  