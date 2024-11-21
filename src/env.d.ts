declare interface Env {
  readonly NODE_ENV: string;

  readonly CUTLYNK_BASE_URL: string;

  readonly CUTLYNK_API_ENDPOINT: string;
  readonly CUTLYNK_PROJECT_ID: string;
  readonly CUTLYNK_DATABASE_ID: string;

  readonly CUTLYNK_USERS_COLLETION: string;
  readonly CUTLYNK_URL_COLLETION: string;
  readonly CUTLYNK_CATEGORY_COLLETION: string;

  [key: string]: any;
}

declare interface ImportMeta {
  readonly env: Env;
}