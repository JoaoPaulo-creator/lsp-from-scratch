import { RequestMessage } from "../server";

type ServerCapabilities = Record<string, unknown>;

interface InitializeResult {
  capabilites: ServerCapabilities;

  serverInfo?: {
    name: string;
    version?: string;
  };
}

export function initialize(message: RequestMessage): InitializeResult {
  return {
    capabilites: { completionProvider: {} },
    serverInfo: {
      name: "lsp-from-scratch",
      version: "0.0.1",
    },
  };
}
