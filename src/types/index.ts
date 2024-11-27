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
    };
    addPath: {
      daily: string;
      note: string;
    };
  };
}

export type { Config };
