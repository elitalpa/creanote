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
  };
}

export type { Config };
