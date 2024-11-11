import {tap} from "rxjs";

/**
 * A function that returns an RxJS `tap` operator to invoke a notification method on the RPC object.
 *
 * @function
 * @param {string} methodName - The name of the notification method to be called on the RPC object.
 * @param {...any} args - Additional arguments to be passed to the notification method.
 * @returns {OperatorFunction<Object, void>} An RxJS `tap` operator that performs a side-effect by
 * calling the specified notification method with the provided arguments.
 */
export const tapNotify = (methodName, ...args) => {
    return tap(rpc => rpc.notify[methodName](...args));
};