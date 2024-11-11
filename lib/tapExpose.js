import {tap} from "rxjs";

/**
 * A function that returns an RxJS `tap` operator to expose an object on the RPC instance.
 *
 * @function
 * @param {Object} exposeObject - The object containing RPC methods to be exposed on the RPC instance.
 * @returns {OperatorFunction<Object, void>} An RxJS `tap` operator that performs a side-effect by
 * calling the `expose` method on the RPC instance with the provided object.
 */
export const tapExpose = (exposeObject) => {
    return tap(rpc => rpc.expose(exposeObject));
};
