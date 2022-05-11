const API_ENDPOINT = "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev";

async function getRequest(url) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("오류가 발생했습니다.");
  }

  return await response.json();
}

class DirectoryClient {
  async getRootDirectory() {
    return await getRequest(API_ENDPOINT);
  }

  async getDirectoryById(id) {
    return await getRequest(`${API_ENDPOINT}/${id}`);
  }
}

export const directoryClient = new DirectoryClient();