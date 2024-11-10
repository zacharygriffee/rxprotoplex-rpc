import {CHANNEL} from "./CHANNEL.js";
import {listenAndConnection$, withEncoding} from "rxprotoplex";
import {map, shareReplay} from "rxjs";
import {rpcFromStream} from "./rpcFromStream.js";

/**
 * Listens for connections on the given plex, sets up a channel with JSON encoding,
 * and returns an observable that emits an RPC instance created from the connected stream.
 *
 * @param {Object} plex - The plex object representing the connection listener.
 * @param {Uint8Array} [channel=CHANNEL] - The channel to use for listening and connection, represented as a `Uint8Array`.
 *                                          Defaults to `CHANNEL`, which is initialized as `b4a.from("$RPC$")`.
 * @returns {Observable} An observable that emits an RPC instance created from the connected stream.
 */
const listenAndConnectionAndRpc$ = (plex, channel = CHANNEL) => {
    return listenAndConnection$(plex, channel, withEncoding("json")).pipe(
        map(s => rpcFromStream(s)),
        shareReplay(1)
    );
};

export {listenAndConnectionAndRpc$};