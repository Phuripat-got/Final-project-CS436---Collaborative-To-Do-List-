# Technology_Stack_Justification
**Project:** Real-time Multi-user To-Do List Application

---

## 1. Frontend: React.js
* **ประเภท:** JavaScript Library สำหรับสร้าง User Interface (UI)
* **เหตุผลที่เลือก:** React มีความโดดเด่นเรื่องการจัดการ **Virtual DOM** และ **State Management**
* **ความเหมาะสมกับโจทย์:** * ระบบ To-Do List มีการเปลี่ยนแปลงหน้าจอบ่อยมาก (เช่น การติ๊กถูก, การพิมพ์, การลบ) ซึ่ง React สามารถจัดการการเปลี่ยนแปลงเหล่านี้ (Re-render) ได้อย่างลื่นไหลโดยไม่ต้องรีเฟรชหน้าเว็บใหม่ทั้งหมด
    * สามารถสร้าง Component ซ้ำๆ (Reusable Components) เช่น `TaskItem` ทำให้โค้ดเป็นระเบียบและดูแลรักษาง่าย

## 2. Backend: Node.js & Express
* **ประเภท:** Runtime Environment และ Web Framework
* **เหตุผลที่เลือก:** ทำงานแบบ **Non-blocking I/O** และ **Event-driven**
* **ความเหมาะสมกับโจทย์:** * เหมาะอย่างยิ่งสำหรับระบบ Real-time ที่ต้องรองรับการเชื่อมต่อจำนวนมากพร้อมกัน (High Concurrency) โดยไม่กินทรัพยากรเซิร์ฟเวอร์
    * การใช้ภาษา JavaScript ทั้ง Frontend และ Backend (Unified Language) ช่วยให้ทีมพัฒนาทำงานได้รวดเร็วขึ้น และลดความซับซ้อนในการสลับบริบทภาษา

## 3. Real-time Engine: Socket.io
* **ประเภท:** Library สำหรับการสื่อสารแบบสองทิศทาง (Bi-directional Communication)
* **เหตุผลที่เลือก:** เป็นมาตรฐานอุตสาหกรรมสำหรับการทำ WebSocket ที่ใช้งานง่ายและเสถียร
* **ความเหมาะสมกับโจทย์:** * เป็นหัวใจสำคัญของระบบนี้ ช่วยให้ Server สามารถ **"Push" (ผลัก)** ข้อมูลไปหา Client (User B) ได้ทันทีเมื่อ User A มีการแก้ไขงาน
    * ตอบโจทย์ฟังก์ชัน **Instant Sync** และ **Broadcast** โดยไม่ต้องให้ผู้ใช้กดรีเฟรชหรือรอเวลา (Low Latency)

## 4. Database: MongoDB
* **ประเภท:** NoSQL Database
* **เหตุผลที่เลือก:** จัดเก็บข้อมูลในรูปแบบ **Document (JSON-like)**
* **ความเหมาะสมกับโจทย์:** * โครงสร้างข้อมูลของ Task (เช่น `title`, `isCompleted`, `createdBy`) อยู่ในรูปแบบ JSON อยู่แล้ว ทำให้สามารถบันทึกลงฐานข้อมูลได้ทันทีโดยไม่ต้องแปลงโครงสร้าง (No Impedance Mismatch)
    * มีความยืดหยุ่นสูง (Schema-less) หากในอนาคตต้องการเพิ่มฟีเจอร์ เช่น การติด Tag หรือเพิ่มหมวดหมู่ ก็สามารถทำได้โดยไม่ต้องรื้อโครงสร้างฐานข้อมูลเดิม
