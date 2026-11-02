AI Girl Voice Changer — Cartesia Backend Prototype

এই প্রজেক্টে:
- অনুমতিপ্রাপ্ত রেফারেন্স অডিও দিয়ে private voice clone
- নিজের রেকর্ড করা অডিও Cartesia Voice Changer API-তে পাঠানো
- পরিবর্তিত WAV অডিও ফেরত পাওয়া

গুরুত্বপূর্ণ:
- এটি recorded-audio conversion; live real-time নয়।
- WhatsApp/IMO/Messenger call microphone বদলায় না।
- Clone audio: 10–60 seconds, clean single-speaker sample, <=16 MB.
- API key কখনো public HTML/JavaScript-এ রাখবে না।

চালানোর নিয়ম (Node.js 20+):
1. এই ফোল্ডার backend hosting service-এ deploy করো, অথবা Node.js-সহ কম্পিউটারে চালাও।
2. `npm install`
3. `.env.example` কপি করে `.env` বানাও।
4. `.env`-এ নিজের Cartesia API key বসাও।
5. `npm start`
6. ব্রাউজারে `http://localhost:3000` খোলো।

Android-এর Acode বা 200 OK static web server শুধু HTML চালাতে পারে; Node.js backend চালাতে পারে না।
ফোন থেকেই ব্যবহার করতে চাইলে backend-টি Render/Railway-এর মতো Node.js hosting-এ deploy করতে হবে।
Hosting dashboard-এর Environment Variables-এ CARTESIA_API_KEY যোগ করবে; key কখনো GitHub-এ commit করবে না।

API:
- POST /api/clone — multipart fields: clip, name, language
- POST /api/convert — multipart fields: clip, voice_id
- GET /health — health check

বাংলা clone-এর language code `bn` দেওয়া আছে। Cartesia account/model support ও billing/credits যাচাই করে নিও।
