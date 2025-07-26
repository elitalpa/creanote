interface Config {
  info: {
    name: string;
    author: string;
    url: string;
    license: string;
  };
  settings: {
    templatePath: {
      daily: string;
      note: string;
      excalidraw: string;
    };
    addPath: {
      daily: string;
      note: string;
      excalidraw: string;
    };
    sync?: {
      user: {
        name: string;
        email: string;
      };
      remote: {
        url: string;
      };
    };
    ai?: {
      llm: {
        modelName: string;
        provider: {
          type: string;
          apiKeyPath: string;
          apiUrl: string;
        };
        prompt: {
          ask: {
            system: string;
            user: string;
          };
          chat: {
            system: string;
            user: string;
          };
          add: {
            system: string;
            user: string;
          };
        };
      };
    };
  };
}

export type { Config };
