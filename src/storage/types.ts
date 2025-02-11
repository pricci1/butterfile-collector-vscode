export interface Collection {
  name: string;
  files: string[];
}

export interface StorageProvider {
  loadCollections(): Promise<Collection[]>;
  saveCollections(collections: Collection[]): Promise<void>;
  validateWorkspace(): Promise<boolean>;
}
