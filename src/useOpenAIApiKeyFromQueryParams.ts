export const useOpenAIApiKeyFromQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("openAIApiKey");
};
