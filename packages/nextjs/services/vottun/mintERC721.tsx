const mintERC721 = async (data: any): Promise<any> => {
  const url = "https://api.vottun.tech/erc/v1/erc721/mint"; // Asegúrate de que la URL sea correcta

  // Verifica que las variables de entorno estén definidas
  const appId = process.env.NEXT_PUBLIC_APP_ID;
  const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

  if (!appId || !apiToken) {
    throw new Error("Las variables de entorno NEXT_PUBLIC_APP_ID y NEXT_PUBLIC_API_TOKEN deben estar definidas.");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors", // Deshabilitar CORS
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "x-application-vkn": appId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deploying ERC721:", error);
    throw error; // Puedes manejar el error como desees
  }
};

export default mintERC721;
