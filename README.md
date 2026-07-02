# Fit With Me - Body Recomposition Tracker

Web Application สำหรับติดตามการออกกำลังกายและโภชนาการสำหรับแผนระยะเวลา 3 เดือน (Body Recomposition)
พัฒนาด้วย **Next.js 14+ (App Router)**, **Tailwind CSS**, และจัดการ State ด้วย **Zustand** + **Local Storage**

---

## 🚀 การรันโปรเจกต์บนเครื่อง (Local Development)

### สิ่งที่ต้องมี
- Node.js (เวอร์ชัน 20 หรือใหม่กว่า)
- npm หรือ yarn

### วิธีรัน
1. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```

2. รัน Development Server:
   ```bash
   npm run dev
   ```

3. เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

## 🐳 การรันด้วย Docker บนเครื่อง Local (MacBook)

หากต้องการทดสอบ Docker Image ก่อนนำไป Deploy จริง:

1. Build Image:
   ```bash
   docker build -t fit-with-me .
   ```

2. รัน Container (แอปจะถูกรันที่พอร์ต 8080 ตามที่ตั้งไว้):
   ```bash
   docker run -p 8080:8080 fit-with-me
   ```

3. เปิดเบราว์เซอร์ไปที่ [http://localhost:8080](http://localhost:8080)

---

## ☁️ การ Deploy บน Google Cloud Run (สำคัญสำหรับ MacBook M4 / Apple Silicon)

เนื่องจากคุณใช้ MacBook M4 ซึ่งเป็นชิปสถาปัตยกรรม ARM64 (Apple Silicon) หากคุณ Build Docker Image บนเครื่องแล้ว Push ไปรันบน Cloud Run โดยตรง อาจจะเจอ Error (`exec user process caused: exec format error`) เนื่องจาก Cloud Run คาดหวัง Image ที่เป็นสถาปัตยกรรม `linux/amd64` (x86_64)

มี 2 วิธีหลักในการ Deploy เพื่อแก้ปัญหานี้:

### วิธีที่ 1: Build Image บนเครื่องด้วย `--platform linux/amd64` แล้ว Push (เหมาะสำหรับคนอยากจัดการ Image เอง)

วิธีนี้จะต้องติดตั้งและ Login `gcloud` CLI และตั้งค่า Docker ให้รู้จัก Google Container Registry (GCR) หรือ Artifact Registry (GAR)

1. **Build Image สำหรับ AMD64:**
   ```bash
   docker build --platform linux/amd64 -t gcr.io/[PROJECT_ID]/fit-with-me .
   ```
   *(เปลี่ยน `[PROJECT_ID]` เป็น Project ID ของคุณบน Google Cloud)*

2. **Push Image ขึ้น Google Cloud:**
   ```bash
   docker push gcr.io/[PROJECT_ID]/fit-with-me
   ```

3. **Deploy ไปยัง Cloud Run:**
   ```bash
   gcloud run deploy fit-with-me \
     --image gcr.io/[PROJECT_ID]/fit-with-me \
     --platform managed \
     --region asia-southeast1 \
     --allow-unauthenticated \
     --port 8080
   ```

---

### วิธีที่ 2: ให้ Cloud Build จัดการ Build ให้ (⭐ แนะนำสำหรับ MacBook Apple Silicon)

วิธีนี้ง่ายที่สุดและไม่ต้องกังวลเรื่อง Architecture Mismatch เพราะ Google Cloud จะดึง Source Code ของเราไป Build บน Server ของเขา (ซึ่งเป็น AMD64 อยู่แล้ว)

1. ตรวจสอบให้แน่ใจว่า Login Google Cloud CLI แล้ว:
   ```bash
   gcloud auth login
   gcloud config set project [PROJECT_ID]
   ```

2. รันคำสั่ง Deploy จาก Folder ของโปรเจกต์:
   ```bash
   gcloud run deploy fit-with-me \
     --source . \
     --region asia-southeast1 \
     --allow-unauthenticated \
     --port 8080
   ```
   *ตัว Cloud Run จะตรวจเจอ `Dockerfile` ในเครื่องและส่งไปให้ Cloud Build ทำการ Build Image และ Deploy ให้แบบอัตโนมัติ 100%*
   
**หมายเหตุ**: ระหว่างขั้นตอนการใช้ `--source .` ทาง gcloud อาจจะถามว่าต้องการบันทึก Image ไว้ที่ Artifact Registry หรือไม่ ให้ตอบ `Y` ได้เลย

## 🛠 ฟีเจอร์หลัก
- **Daily Dashboard**: ดูสรุปแคลอรี่, โปรตีน, และการออกกำลังกายรายวัน
- **Diet Tracker**: ปุ่ม Quick Add อาหารพื้นฐาน (เวย์, อกไก่, ไข่ต้ม) พร้อมฟอร์มกำหนดเอง
- **Workout Tracker**: ตารางออกกำลังกายรายสัปดาห์แบบ Gamified (มี Animation ขีดฆ่าเมื่อทำเสร็จ)
- **Progress Tracker**: กราฟติดตามน้ำหนักตัว และบันทึกเปอร์เซ็นต์ไขมัน
- **Local Storage**: ข้อมูลทั้งหมดถูกจัดเก็บใน Browser (ไม่ต้องใช้ Database สมัครสมาชิก)
