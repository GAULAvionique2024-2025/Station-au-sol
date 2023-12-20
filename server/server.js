const path = require('path');
const express = require('express');
const app = express();
const port = 80

// Fourni les fichiers statiques du dossier client
app.use(express.static(path.join(__dirname, '..', 'client')));

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})