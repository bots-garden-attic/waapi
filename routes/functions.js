const spawn = require('child_process').spawn

function execute(wasmFile, jsonParameters, request, reply, options, fastify) {
  let child = spawn(
    "wasmer",
    [`functions/${wasmFile}`, JSON.stringify(jsonParameters)],
    process.env
  )

  child.on('exit', _ => {
    //clearTimeout(timeOut)
    fastify.log.info('🤖 Function exited!')
  })

  child.stdout.on('data', (data) => {
    fastify.log.info(`🤖 ${data}`)
    reply.header('Content-Type', 'application/json; charset=utf-8')
      .send({success: data.toString()}) 
  })

  child.stderr.on('data', (data) => {
    fastify.log.error(`😡 ${data}`)
    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .code(500)
      .send({failure: data})
  })

  /*
    let timeOut = setTimeout( _ => {
      child.kill()
    }, constants.lifeDelay)
  */

}


async function wasmFunctions (fastify, options) {
/*
```bash
url_api=$(gp url 8080)
function_name="hello"
function_version="first"
data='{"name":"Bob"}'
curl -d "${data}" \
      -H "Content-Type: application/json" \
      -X POST "${url_api}/functions/${function_name}/${function_version}"

url_api=$(gp url 8080)
function_name="grain.hello"
function_version="0.0.0"
http POST "${url_api}/functions/${function_name}/${function_version}"

url_api=$(gp url 8080)
function_name="grain.hey"
function_version="0.0.0"
http POST "${url_api}/functions/${function_name}/${function_version}" \
     name=Bob
``` 
*/
  fastify.post(`/functions/:function_name/:function_version`, async (request, reply) => {
    let jsonParameters = request.body
    let functionName = request.params.function_name
    let functionVersion = request.params.function_version
    let wasmFile = `${functionName}_v_${functionVersion}.wasm`

    execute(wasmFile, jsonParameters, request, reply, options, fastify)
    
    await reply
  })

}

module.exports = wasmFunctions
