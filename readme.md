# rxprotoplex-rpc

## Overview
`connectAndRpc$` and `listenAndConnectionAndRpc$` are utility functions designed for establishing connections and creating RPC (Remote Procedure Call) instances from streams in a reactive programming context. These functions are built using RxJS and leverage JSON encoding for data transmission over specified channels.

## Usage
### Importing the Functions
To use `connectAndRpc$` and `listenAndConnectionAndRpc$`, make sure to import them from your module:

```javascript
import { connectAndRpc$, listenAndConnectionAndRpc$ } from 'rxprotoplex-rpc';
```

### `connectAndRpc$`

#### Description
Establishes a connection to the provided `plex` object, sets up a communication channel with JSON encoding, and returns an observable that emits an RPC instance created from the stream.

#### Syntax
```javascript
const rpc$ = connectAndRpc$(plex, channel);
```

#### Parameters
- **`plex`** (Object): The connection object representing the peer or signaling entity.
- **`channel`** (Uint8Array, optional): The channel for the connection, defaulting to `CHANNEL` (`b4a.from("$RPC$")`).

#### Returns
- **Observable**: An observable that emits an RPC instance created from the connected stream.

#### Example
```javascript
connectAndRpc$(plex).subscribe(rpc => {
    // Use the rpc instance here
    rpc.request.someMethod().then(response => console.log(response));
});
```

### `listenAndConnectionAndRpc$`

#### Description
Listens for connections on the given `plex` object, sets up a communication channel with JSON encoding, and returns an observable that emits an RPC instance created from the connected stream.

#### Syntax
```javascript
const rpc$ = listenAndConnectionAndRpc$(plex, channel);
```

#### Parameters
- **`plex`** (Object): The connection listener object representing where connections are managed.
- **`channel`** (Uint8Array, optional): The channel for listening and connection, defaulting to `CHANNEL` (`b4a.from("$RPC$")`).

#### Returns
- **Observable**: An observable that emits an RPC instance created from the connected stream.

#### Example
```javascript
listenAndConnectionAndRpc$(plex).subscribe(rpc => {
    // Use the rpc instance here
    rpc.request.anotherMethod().then(result => console.log(result));
});
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

