interface Template {
  name: string;
  description: string;
  path: string;
  ext: string;
  target: string;
}

interface AIPrompts {
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
}

interface AIProvider {
  type: string;
  apiKey?: {
    path: string;
    variable: string;
  };
  baseURL?: string;
}

interface AIModel {
  name: string;
}

interface AILLM {
  model: AIModel;
  provider: AIProvider;
  prompt: AIPrompts;
}

interface AI {
  llm: AILLM;
}

interface SyncUser {
  name: string;
  email: string;
}

interface SyncRemote {
  url: string;
  branch: string;
}

interface Sync {
  user: SyncUser;
  remote: SyncRemote;
}

interface Settings {
  basePath: string;
  templates: Template[];
  ai?: AI;
  sync?: Sync;
}

interface Config {
  info: {
    name: string;
    version?: string;
    author: string;
    url: string;
    license: string;
  };
  settings: Settings;
}

// Legacy config interface for migration
interface LegacyConfig {
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

export type { Config, LegacyConfig, Template, AI, Sync };
