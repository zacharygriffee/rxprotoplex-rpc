import {createRpc} from 'rpc-async';
import FramedStream from 'framed-stream';

export function rpcFromStream(stream, config = {}) {
    const { bits = 32, frame = false } = config;
    const framedStream = frame ? new FramedStream(stream, { bits }) : stream;

    return Object.assign(createRpc({
        send: (data) => {
            // console.log("Sending data", data);
            return framedStream.write(data);
        },
        attach: (route) => {
            // Handle incoming framed messages
            framedStream.on("error", e => {
                console.trace();
                route({error: "Stream error"})
            });
            framedStream.on('data', (chunk) => {
                try {
                    route(chunk);
                } catch (error) {
                    if (error.message === "fn is not a function" && chunk.method) {
                        console.error(new Error(`${chunk.method} function does not exist on remote.`))
                        route({ error, id: chunk.id });
                    } else {
                        route({error: "RPC error", id: chunk.id})
                    }
                }
            });

            return () => framedStream.destroy();  // Cleanup the framed stream
        }
    }), {stream});
}
