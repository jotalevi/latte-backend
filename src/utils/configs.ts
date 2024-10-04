const config = {
  port: 3000,
  scrape_url: 'https://ww6.gogoanimes.org',
  mongo_url: 'mongodb+srv://latte_admin:1kXqUbKBdETa5reg@cluster0.sd7in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
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
