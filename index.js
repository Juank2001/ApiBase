const app = require('./src/server/server')

const port = process.env['PORT_'+process.env.DEPLOYMENT]

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})