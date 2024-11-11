import {from, map, switchMap} from "rxjs";

/**
 * A function that returns an RxJS operator using `switchMap` to handle RPC requests.
 *
 * @function
 * @param {string} method - The method name to be called on the RPC request object.
 * @param {...any} args - Additional arguments to be passed to the method.
 * @returns {OperatorFunction<Object, Object>} An RxJS operator that maps an input observable to an observable
 * that makes an RPC request using the specified method and arguments, and emits an object containing
 * the RPC instance and acknowledgment response.
 */
export const switchRpcRequest = (method, ...args) => {
    return switchMap(rpc => from(rpc.request[method](...args)).pipe(
        map(ack => ({ rpc, ack }))
    ));
};