const username = 'alistairwalsh';
const selectors = {
  repos: document.querySelector('[data-stat="repos"]'),
  followers: document.querySelector('[data-stat="followers"]'),
  stars: document.querySelector('[data-stat="stars"]'),
  years: document.querySelector('[data-stat="years"]'),
};
const projectGrid = document.getElementById('project-grid');
const creativeGrid = document.getElementById('creative-grid');
const toolList = document.getElementById('tool-list');
const footerYear = document.getElementById('footer-year');

const formatNumber = (value) => {
  if (typeof value !== 'number') return '–';
  return value.toLocaleString();
};

const createMetaIcon = (path) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `<path d="${path}"/>`;
  return svg;
};

const starPath = 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';
const clockPath = 'M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8zm.5-13h-1v6l5.25 3.15.5-.84-4.75-2.81z';

const clearNode = (node) => {
  if (!node) return;
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

const createBadge = (text, variant = 'default') => {
  const span = document.createElement('span');
  span.className = `badge badge-${variant}`;
  span.textContent = text;
  return span;
};

const createProjectCard = (repo, { highlightFork = false } = {}) => {
  const article = document.createElement('article');
  article.className = 'project-card';

  const title = document.createElement('h3');
  title.textContent = repo.name.replace(/[-_]/g, ' ');
  article.appendChild(title);

  if (highlightFork && repo.fork) {
    article.appendChild(createBadge('Forked exploration', 'outline'));
  } else if (!repo.fork) {
    article.appendChild(createBadge('Original build', 'solid'));
  }

  const description = document.createElement('p');
  description.textContent = repo.description || 'No description added yet—discover the code on GitHub.';
  article.appendChild(description);

  const meta = document.createElement('div');
  meta.className = 'project-meta';

  const star = document.createElement('span');
  star.appendChild(createMetaIcon(starPath));
  star.appendChild(document.createTextNode(formatNumber(repo.stargazers_count)));
  meta.appendChild(star);

  if (repo.language) {
    const lang = document.createElement('span');
    lang.textContent = repo.language;
    meta.appendChild(lang);
  }

  if (repo.pushed_at) {
    const updated = document.createElement('span');
    updated.appendChild(createMetaIcon(clockPath));
    const date = new Date(repo.pushed_at);
    updated.appendChild(document.createTextNode(date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })));
    meta.appendChild(updated);
  }

  article.appendChild(meta);

  const link = document.createElement('a');
  link.href = repo.html_url;
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = 'button ghost';
  link.textContent = 'View on GitHub';
  article.appendChild(link);

  return article;
};

const createToolCard = (item) => {
  const article = document.createElement('article');
  article.className = 'tool-card';

  if (item.created_at) {
    const time = document.createElement('time');
    time.dateTime = item.created_at;
    time.textContent = new Date(item.created_at).getFullYear();
    article.appendChild(time);
  }

  const title = document.createElement('h3');
  title.textContent = item.description || 'Untitled resource';
  article.appendChild(title);

  const link = document.createElement('a');
  link.href = item.html_url;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Open on GitHub';
  article.appendChild(link);

  return article;
};

const setStats = (user, repos) => {
  if (!user) return;
  if (selectors.repos) selectors.repos.textContent = formatNumber(user.public_repos);
  if (selectors.followers) selectors.followers.textContent = formatNumber(user.followers);
  if (selectors.years) {
    const accountAge = Math.max(1, new Date().getFullYear() - new Date(user.created_at).getFullYear());
    selectors.years.textContent = formatNumber(accountAge);
  }
  if (selectors.stars && Array.isArray(repos)) {
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    selectors.stars.textContent = formatNumber(totalStars);
  }
};

const renderProjects = (repos) => {
  if (!projectGrid) return;
  clearNode(projectGrid);
  if (!Array.isArray(repos)) {
    projectGrid.appendChild(createFallbackCard('Unable to load projects right now.'));
    return;
  }

  const curated = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => {
      if (b.stargazers_count === a.stargazers_count) {
        return new Date(b.pushed_at) - new Date(a.pushed_at);
      }
      return b.stargazers_count - a.stargazers_count;
    })
    .slice(0, 4);

  if (curated.length === 0) {
    projectGrid.appendChild(createFallbackCard('No public projects found yet—check back soon.'));
    return;
  }

  curated.forEach((repo) => projectGrid.appendChild(createProjectCard(repo)));
};

const renderCreative = (repos) => {
  if (!creativeGrid) return;
  clearNode(creativeGrid);
  if (!Array.isArray(repos)) {
    creativeGrid.appendChild(createFallbackCard('Unable to load creative experiments at the moment.'));
    return;
  }

  const creativeRepos = repos
    .filter((repo) => /(audio|music|sound|story|creative)/i.test(`${repo.name} ${repo.description || ''}`))
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 4);

  if (creativeRepos.length === 0) {
    creativeGrid.appendChild(createFallbackCard('Creative experiments will appear here as they are published.'));
    return;
  }

  creativeRepos.forEach((repo) => creativeGrid.appendChild(createProjectCard(repo, { highlightFork: true })));
};

const renderTools = (gists) => {
  if (!toolList) return;
  clearNode(toolList);
  if (!Array.isArray(gists)) {
    toolList.appendChild(createFallbackCard('Unable to load research tooling right now.'));
    return;
  }

  const curated = gists
    .filter((gist) => gist.description && gist.description.trim().length > 0)
    .slice(0, 3);

  if (curated.length === 0) {
    toolList.appendChild(createFallbackCard('Add a description to a gist to feature it here.'));
    return;
  }

  curated.forEach((gist) => toolList.appendChild(createToolCard(gist)));
};

const createFallbackCard = (message) => {
  const article = document.createElement('article');
  article.className = 'project-card placeholder';
  const heading = document.createElement('h3');
  heading.textContent = message;
  article.appendChild(heading);
  return article;
};

const fetchJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
};

const initialise = async () => {
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  try {
    const userPromise = fetchJSON(`https://api.github.com/users/${username}`);
    const repoPromise = fetchJSON(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    const gistPromise = fetchJSON(`https://api.github.com/users/${username}/gists?per_page=5`);

    const [user, repos, gists] = await Promise.allSettled([userPromise, repoPromise, gistPromise]);

    if (user.status === 'fulfilled' && repos.status === 'fulfilled') {
      setStats(user.value, repos.value);
      renderProjects(repos.value);
      renderCreative(repos.value);
    } else {
      if (user.status === 'fulfilled') {
        setStats(user.value);
      }
      if (repos.status !== 'fulfilled') {
        renderProjects(null);
        renderCreative(null);
        console.error('Failed to load repositories', repos.reason);
      }
    }

    if (gists.status === 'fulfilled') {
      renderTools(gists.value);
    } else {
      renderTools(null);
      console.error('Failed to load gists', gists.reason);
    }
  } catch (error) {
    console.error('Unexpected error initialising page', error);
    renderProjects(null);
    renderCreative(null);
    renderTools(null);
  }
};

document.addEventListener('DOMContentLoaded', initialise);
