# rxprotoplex-rpc

## Overview
`connectAndRpc$` and `listenAndConnectionAndRpc$` are utility functions designed for establishing connections and creating RPC (Remote Procedure Call) instances from streams in a reactive programming context. These functions are built using RxJS and leverage JSON encoding for data transmission over specified channels. They also include configurable parameters such as timeout settings for enhanced control.

Additionally, the module provides utility operators like `switchRpcRequest`, `tapNotify`, and `tapExpose` for handling RPC requests, notifications, and exposing methods within an observable stream.

## Usage
### Importing the Functions
To use `connectAndRpc$`, `listenAndConnectionAndRpc$`, `switchRpcRequest`, `tapNotify`, and `tapExpose`, make sure to import them from your module:

```javascript
import { connectAndRpc$, listenAndConnectionAndRpc$, switchRpcRequest, tapNotify, tapExpose } from 'rxprotoplex-rpc';
```

### `connectAndRpc$`

#### Description
Establishes a connection to the provided `plex` object, sets up a communication channel with JSON encoding, and returns an observable that emits an RPC instance created from the stream.

#### Syntax
```javascript
const rpc$ = connectAndRpc$(plex, channel, config);
```

#### Parameters
- **`plex`** (Object): The connection object representing the peer or signaling entity.
- **`channel`** (Uint8Array, optional): The channel for the connection, defaulting to `CHANNEL` (`b4a.from("$RPC$")`).
- **`config`** (Object, optional): Configuration object for the RPC setup.
    - **`timeout`** (number, optional): Timeout duration for the RPC, in milliseconds.

#### Returns
- **Observable**: An observable that emits an RPC instance created from the connected stream.

#### Example
```javascript
connectAndRpc$(plex, CHANNEL, { timeout: 5000 }).subscribe(rpc => {
    // Use the rpc instance here
    rpc.request.someMethod().then(response => console.log(response));
});
```

### `listenAndConnectionAndRpc$`

#### Description
Listens for connections on the given `plex` object, sets up a communication channel with JSON encoding, and returns an observable that emits an RPC instance created from the connected stream.

#### Syntax
```javascript
const rpc$ = listenAndConnectionAndRpc$(plex, channel, config);
```

#### Parameters
- **`plex`** (Object): The connection listener object representing where connections are managed.
- **`channel`** (Uint8Array, optional): The channel for listening and connection, defaulting to `CHANNEL` (`b4a.from("$RPC$")`).
- **`config`** (Object, optional): Configuration object for the RPC setup.
    - **`timeout`** (number, optional): Timeout duration for the RPC, in milliseconds.

#### Returns
- **Observable**: An observable that emits an RPC instance created from the connected stream.

#### Example
```javascript
listenAndConnectionAndRpc$(plex, CHANNEL, { timeout: 10000 }).subscribe(rpc => {
    // Use the rpc instance here
    rpc.request.anotherMethod().then(result => console.log(result));
});
```

### `switchRpcRequest`

#### Description
An RxJS operator that switches to a new observable for each emission and makes an RPC request using the specified method and arguments.

#### Syntax
```javascript
observable$.pipe(switchRpcRequest(method, ...args));
```

#### Parameters
- **`method`** (string): The method name to be called on the RPC request object.
- **`args`** (...any): Additional arguments to be passed to the method.

#### Returns
- **OperatorFunction**: An RxJS operator that maps the input observable to an observable that makes an RPC request and emits an object containing the RPC instance and acknowledgment response.

#### Example
```javascript
const [p1, p2] = createPlexPair();

const rpcClient = connectAndRpc$(p2).pipe(
    switchRpcRequest('add', 5, 6),
    tap(({ rpc }) => rpc.stream.destroy())
).subscribe(
    ({ ack: sum }) => {
        console.log('Sum:', sum); // Output: Sum: 11
    }
);
```

### `tapNotify`

#### Description
An RxJS `tap` operator that calls a notification method on the RPC object as a side-effect.

#### Syntax
```javascript
observable$.pipe(tapNotify(methodName, ...args));
```

#### Parameters
- **`methodName`** (string): The name of the notification method to be called on the RPC object.
- **`args`** (...any): Additional arguments to be passed to the notification method.

#### Returns
- **OperatorFunction**: An RxJS `tap` operator that performs a side-effect by calling the specified notification method with the provided arguments.

#### Example
```javascript
observable$.pipe(
    tapNotify('notifyMethod', param1)
).subscribe();
```

### `tapExpose`

#### Description
An RxJS `tap` operator that exposes an object containing RPC methods on the RPC instance.

#### Syntax
```javascript
observable$.pipe(tapExpose(exposeObject));
```

#### Parameters
- **`exposeObject`** (Object): The object containing RPC methods to be exposed on the RPC instance.

#### Returns
- **OperatorFunction**: An RxJS `tap` operator that performs a side-effect by calling the `expose` method on the RPC instance with the provided object.

#### Example
```javascript
const [p1, p2] = createPlexPair();

const rpcServer = listenAndConnectionAndRpc$(p1).pipe(
    tapExpose({
        add(a, b) {
            return a + b;
        }
    })
).subscribe();
```

## Constants
### `CHANNEL`
A predefined constant for channel identification:
```javascript
export const CHANNEL = b4a.from("$RPC$");
```

## License
This module is licensed under [MIT License](LICENSE).

---
For more details on how to extend or modify these functions, refer to the code comments or inline documentation.

