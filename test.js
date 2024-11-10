import {test} from "brittle";
import {createPlexPair} from "rxprotoplex";
import {listenAndConnectionAndRpc$} from "./lib/listenAndConnectionAndRpc$.js";
import {connectAndRpc$} from "./lib/connectAndRpc$.js";
import {from, map, switchMap, tap} from "rxjs";

test("add two numbers over rpc", t => {
    t.plan(2);
    const [p1, p2] = createPlexPair();

    listenAndConnectionAndRpc$(p1).subscribe(
        rpc => {
            rpc.expose({
                add(a,b) {
                    return a+b
                }
            })
        }
    );

    connectAndRpc$(p2).pipe(
        switchMap(rpc =>
            from(rpc.request.add(5, 6))
                .pipe(
                    tap(() => rpc.stream.destroy()),
                    map((sum) => ({rpc, sum}))
                )
        )
    ).subscribe(
        ({sum, rpc}) => {
            t.is(sum, 11);
            t.ok(rpc.stream.destroying || rpc.stream.destroyed);
        }
    );

    t.teardown(() => {
        p1.mux.stream.destroy();
        p2.mux.stream.destroy();
    })
});