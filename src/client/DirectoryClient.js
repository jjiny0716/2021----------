const API_ENDPOINT = "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev";

class DirectoryClient {
  async getRootDirectory() {
    const response = await fetch(API_ENDPOINT);
    return await response.json();
  }

  async getDirectoryById(id) {
    const response = await fetch(`${API_ENDPOINT}/${id}`);
    return await response.json();
  }
}

export const directoryClient = new DirectoryClient();