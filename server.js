require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
});
