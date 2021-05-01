const express = require('express')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.listen(PORT, () => {
    console.log(`Express server is listening on port: ${PORT}`)
})
