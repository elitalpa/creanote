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
  };
}

export type { Config };
