const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SUBMISSIONS_DIR = path.join(__dirname, 'submissions');

// Ensure submissions directory exists
if (!fs.existsSync(SUBMISSIONS_DIR)) {
    fs.mkdirSync(SUBMISSIONS_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `submission-${timestamp}.json`;
    const filepath = path.join(SUBMISSIONS_DIR, filename);

    const submissionData = {
        name,
        email,
        message,
        receivedAt: new Date().toISOString()
    };

    fs.writeFile(filepath, JSON.stringify(submissionData, null, 2), (err) => {
        if (err) {
            console.error('Failed to save submission:', err);
            return res.status(500).json({ error: 'Internal server error.' });
        }
        console.log(`Saved submission: ${filename}`);
        return res.status(200).json({ success: true, message: 'Submission saved successfully.' });
    });
});

app.listen(PORT, () => {
    console.log(`Portfolio backend server running on http://localhost:${PORT}`);
});