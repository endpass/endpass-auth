import githubOauthPopup from 'github-oauth-popup';

jest.mock('github-oauth-popup', () => ({
  loginWithGithub: jest.fn()
}));

export default githubOauthPopup;
