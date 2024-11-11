import {CHANNEL} from "./CHANNEL.js";
import {connect$, withEncoding} from "rxprotoplex";
import {map, shareReplay} from "rxjs";
import {rpcFromStream} from "./rpcFromStream.js";

/**
 * Establishes a connection to the given plex, sets up a channel with JSON encoding,
 * and returns an observable that emits an RPC instance created from the stream.
 *
 * @param {Object} plex - The plex object representing the connection.
 * @param {Uint8Array} [channel=CHANNEL] - The channel to use for the connection, represented as a `Uint8Array`.
 *                                          Defaults to `CHANNEL`, which is initialized as `b4a.from("$RPC$")`.
 * @param {Object} [config={}] - Configuration object for the RPC setup.
 * @param {number} [config.timeout] - Timeout duration for the RPC, in milliseconds.
 *
 * @returns {Observable} An observable that emits an RPC instance created from the connected stream.
 */
const connectAndRpc$ = (plex, channel = CHANNEL, config = {}) => {
    const {
        timeout // rpc timeout
    } = config;
    return connect$(plex, channel, withEncoding("json")).pipe(
        map(s => rpcFromStream(s, { timeout })),
        shareReplay(1)
    );
};


export {connectAndRpc$};