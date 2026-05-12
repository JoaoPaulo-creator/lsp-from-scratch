import log from "./log";
import { initialize } from "./methods/initialize";

interface Message {
  jsonrpc: string;
}

export interface NotificationMessage extends Message {
  method: string;
  params?: unknown[] | object;
}

type RequestMethod = (message: RequestMessage) => object;

// type RequestMethod = (
//   message: RequestMessage,
// ) => ReturnType<typeof initialize> | ReturnType<typeof completion>;

const methodLookup: Record<string, RequestMethod> = {
  initialize,
};

function respond(id: RequestMessage["id"], result: object | null): void {
  const message = JSON.stringify({ id, result });
  const messageLength = Buffer.byteLength(message, "utf-8");
  const header = `Content-Length: ${messageLength}\r\n\r\n`;

  log.write(header + message);
  process.stdout.write(header + message);
}

export interface RequestMessage extends Message {
  id: number | string;
  method: string;
  params?: unknown[] | object;
}

let buffer = "";
process.stdin.on("data", (chunk) => {
  buffer += chunk;

  while (true) {
    const lengthMatch = buffer.match(/Content-Length: (\d+)\r\n/);
    if (!lengthMatch) break;

    const contentLength = parseInt(lengthMatch[1], 10);
    const messageStart = buffer.indexOf("\r\n\r\n") + 4;

    // continua a menos que toda a mensagem esteja no buffer
    if (buffer.length < messageStart + contentLength) break;

    const rawMessage = buffer.slice(messageStart, messageStart + contentLength);
    const message = JSON.parse(rawMessage);

    log.write({ id: message.id, method: message.method });

    const method = methodLookup[message.method];
    if (method) {
      respond(message.id, method(message));
    }

    // remove mensagem procesada do buffer
    buffer = buffer.slice(messageStart + contentLength);
  }
});
