import type { Collection, StorageProvider } from "../storage/types";

export class CollectionManager {
  constructor(private storage: StorageProvider) {}

  async createCollection(name: string): Promise<void> {
    const collections = await this.storage.loadCollections();
    if (collections.some((c) => c.name === name)) {
      throw new Error(`Collection "${name}" already exists`);
    }
    collections.push({ name, files: [] });
    await this.storage.saveCollections(collections);
  }

  async getCollections(): Promise<Collection[]> {
    return this.storage.loadCollections();
  }

  async getCollection(name: string): Promise<Collection | undefined> {
    const collections = await this.storage.loadCollections();
    return collections.find((c) => c.name === name);
  }

  async addFilesToCollection(collectionName: string, filePaths: string[]): Promise<void> {
    const collections = await this.storage.loadCollections();
    const collection = collections.find((c) => c.name === collectionName);
    if (!collection) throw new Error("Collection not found");

    collection.files = [...new Set([...collection.files, ...filePaths])];
    await this.storage.saveCollections(collections);
  }

  async removeFilesFromCollection(collectionName: string, filePaths: string[]): Promise<void> {
    const collections = await this.storage.loadCollections();
    const collection = collections.find((c) => c.name === collectionName);
    if (!collection) throw new Error("Collection not found");

    collection.files = collection.files.filter((file) => !filePaths.includes(file));
    await this.storage.saveCollections(collections);
  }

  async deleteCollection(name: string): Promise<void> {
    const collections = await this.storage.loadCollections();
    const index = collections.findIndex((c) => c.name === name);
    if (index === -1) throw new Error("Collection not found");

    collections.splice(index, 1);
    await this.storage.saveCollections(collections);
  }

  async renameCollection(oldName: string, newName: string): Promise<void> {
    const collections = await this.storage.loadCollections();
    if (collections.some((c) => c.name === newName)) {
      throw new Error(`Collection "${newName}" already exists`);
    }

    const collection = collections.find((c) => c.name === oldName);
    if (!collection) throw new Error("Collection not found");

    collection.name = newName;
    await this.storage.saveCollections(collections);
  }

  async cloneCollection(sourceName: string, targetName: string): Promise<void> {
    const collections = await this.storage.loadCollections();
    if (collections.some((c) => c.name === targetName)) {
      throw new Error(`Collection "${targetName}" already exists`);
    }

    const sourceCollection = collections.find((c) => c.name === sourceName);
    if (!sourceCollection) throw new Error("Source collection not found");

    collections.push({
      name: targetName,
      files: [...sourceCollection.files],
    });

    await this.storage.saveCollections(collections);
  }
}
