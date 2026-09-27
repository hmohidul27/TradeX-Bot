const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// টেলিগ্রাম ক্রেডেনশিয়ালস
const BOT_TOKEN = '8883240267:AAH3gQuF1i8vGZ2vJ0tMu652sHbZIpyiP9A';
const CHAT_ID = '8827085716';

// আপনার নিজের টেস্টিংয়ের জন্য ফিক্সড টেস্ট ইউআইডি
const TEST_UID = 'ADMIN999';

// সার্ভার লাইভ আছে কিনা তা চেক করার জন্য
app.get('/', (req, res) => {
    res.send('TradeX-Lite-Bot is live!');
});

// কোটেক্স পোস্টব্যাক / ওয়েবহুক রুট (রেজিস্ট্রেশন ও ডিপোজিট নোটিফিকেশনের জন্য)
app.get('/webhook', async (req, res) => {
    const { uid, dep, reg, sumdep } = req.query;

    let message = '';

    // যদি কেউ নতুন একাউন্ট তৈরি করে
    if (reg === 'true' && !dep) {
        message = `👤 New Registration!\nUID: ${uid || 'N/A'}`;
    } 
    // যদি কেউ ডিপোজিট করে
    else if (dep === 'true' || (sumdep && sumdep > 0)) {
        message = `💰 New Deposit!\nUID: ${uid || 'N/A'} - DP $${sumdep || '0'}`;
    }

    if (message) {
        try {
            const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;
            await fetch(telegramUrl);
        } catch (error) {
            console.error('Telegram Error:', error);
        }
    }

    res.sendStatus(200);
});

// অ্যাপের লগইন বা অ্যাক্সেস চেক করার রুট
app.post('/check-access', (req, res) => {
    const { uid } = req.body;

    // যদি টেস্ট ইউআইডি দিয়ে লগইন করা হয়, তবে সরাসরি এক্সেস দিয়ে দিবে
    if (uid === TEST_UID) {
        return res.json({ success: true, message: "Test access granted!" });
    }

    // সাধারণ ইউজারদের ক্ষেত্রে (ভবিষ্যতে এখানে ডাটাবেস চেক যুক্ত করতে পারেন)
    res.json({ success: false, message: "Please complete deposit to get access." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
