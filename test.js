import {test} from "brittle";
import {createPlexPair, destroy} from "rxprotoplex";
import {listenAndConnectionAndRpc$} from "./lib/listenAndConnectionAndRpc$.js";
import {connectAndRpc$} from "./lib/connectAndRpc$.js";
import {finalize, from, map, switchMap, take, takeUntil, tap, timer} from "rxjs";
import {switchRpcRequest} from "./lib/switchRpcRequest.js";
import {tapExpose} from "./lib/tapExpose.js";

test("math over rpc", t => {
    t.plan(7);
    const [p1, p2] = createPlexPair();

    p1.close$.subscribe(() => t.pass());
    p2.close$.subscribe(() => t.pass());

    listenAndConnectionAndRpc$(p1)
        .pipe(
            finalize(() => t.pass("rpc server completes.")),
            takeUntil(timer(100)),
            tapExpose({
                add(a, b) {
                    return a + b;
                },
                mul(a, b) {
                    return a * b;
                }
            }),
        )
        .subscribe();

    connectAndRpc$(p2).pipe(
        finalize(() => t.pass("rpc client completes.")),
        switchRpcRequest("add", 5, 6),
        take(1)
    ).subscribe(
        {
            next: ({ack: sum}) => {
                t.is(sum, 11);
            }
        }
    );

    connectAndRpc$(p2).pipe(
        finalize(() => t.pass("rpc client completes.")),
        switchRpcRequest("mul", 5, 6),
        take(1)
    ).subscribe(
        {
            next: ({ack: mul}) => {
                t.is(mul, 30);
            }
        }
    );

    setTimeout(() => {
        destroy(p1);
        destroy(p2);
    }, 500);
});


