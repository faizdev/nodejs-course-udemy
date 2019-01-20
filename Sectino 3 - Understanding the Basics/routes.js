const fs = require("fs")

const requestHandler = (req, res) => {
  const url = req.url
  const method = req.method

  if (url === "/") {
    // SET RESPONSE HEADER
    res.setHeader("Content-type", "text/html")

    // SET RESPONSE BODY
    res.write(`<html>
                                                  <head>
                                                      <title>sudah</title>
                                                  </head>
                                                  <body>
                                                      <form action="/message" method="POST">
                                                          <input type="text" name="message" />
                                                          <button type="submit"> Submit </button>
                                                      </form>
                                                  </body>
                                                  </html>
                                                  `)

    // SEND BACK THE RESULT
    return res.end()
  }

  if (url === "/message" && method === "POST") {
    const body = []
    req.on("data", chunk => {
      console.log(chunk)
      body.push(chunk)
    })
    req.on("end", () => {
      const paresedBody = Buffer.concat(body).toString()
      const message = paresedBody.split("=")[1]
      fs.writeFileSync("message.txt", message)
    })

    res.statusCode = 302
    res.setHeader("Location", "/")
    return res.end()
  }
  // SET RESPONSE HEADER
  res.setHeader("Content-type", "text/html")

  // SET RESPONSE BODY
  res.write(`<html>
                                                <head>
                                                    <title>sudah</title>
                                                </head>
                                                <body>
                                                    Hello boy
                                                </body>
                                                </html>
                                                `)

  // SEND BACK THE RESULT
  res.end()
}


module.exports = requestHandler