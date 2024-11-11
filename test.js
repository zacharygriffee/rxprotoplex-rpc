import {test} from "brittle";
import {createPlexPair} from "rxprotoplex";
import {listenAndConnectionAndRpc$} from "./lib/listenAndConnectionAndRpc$.js";
import {connectAndRpc$} from "./lib/connectAndRpc$.js";
import {finalize, from, map, switchMap, tap} from "rxjs";
import {switchRpcRequest} from "./lib/switchRpcRequest.js";
import {tapExpose} from "./lib/tapExpose.js";

test("add two numbers over rpc", t => {
    t.plan(6);
    const [p1, p2] = createPlexPair();

    p1.mux.stream.once("close", () => t.pass());
    p2.mux.stream.once("close", () => t.pass());

    const rpcServer = listenAndConnectionAndRpc$(p1)
        .pipe(
            finalize(() => t.pass("rpc server completes.")),
            tapExpose({
                add(a, b) {
                    return a + b;
                }
            })
        )
        .subscribe();

    const rpcClient = connectAndRpc$(p2).pipe(
        finalize(() => t.pass("rpc client completes.")),
        switchRpcRequest("add", 5, 6),
        tap(({rpc}) => rpc.stream.destroy())
    ).subscribe(
        ({ack: sum, rpc}) => {
            t.is(sum, 11);
            t.ok(rpc.stream.destroying || rpc.stream.destroyed);
            fin();
        }
    );

    // streams do not close when subscription ends, you still need to clean them up
    function fin() {
        rpcServer.unsubscribe();
        rpcClient.unsubscribe();

        p1.mux.stream.end();
        p2.mux.stream.end();
    }
});