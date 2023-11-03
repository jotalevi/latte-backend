const config = {
  port: '3000',
  scrape_url: 'https://ww2.gogoanimes.org',
  rule_path: {
    popular: '/popular?page=',
    search: '/search?keyword=',
    anime: '/category/',
    episode: '/watch/',
  },
  api_path: '/api/',
  page_path: '/',
};

export default config;
