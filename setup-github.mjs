import { Octokit } from '@octokit/rest';

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function createRepository() {
  try {
    const octokit = await getGitHubClient();
    
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`\n✓ Connected to GitHub as: ${user.login}`);
    
    const repoName = 'mortgage-crm';
    
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: 'Full-featured mortgage loan tracking CRM system with client management, pipeline tracking, and GDS/TDS qualification calculator',
      private: false,
      auto_init: false
    });
    
    console.log(`\n✓ Created repository: ${repo.full_name}`);
    console.log(`✓ Repository URL: ${repo.html_url}`);
    console.log(`✓ Git URL: ${repo.clone_url}`);
    
    console.log(`\n📋 Next steps - Run these commands in the Shell:\n`);
    console.log(`git remote add origin ${repo.clone_url}`);
    console.log(`git add .`);
    console.log(`git commit -m "Initial commit - Mortgage CRM with Property Library"`);
    console.log(`git push -u origin main`);
    
  } catch (error) {
    if (error.status === 422) {
      console.log('\n⚠️  Repository "mortgage-crm" already exists on your GitHub account.');
      console.log('\nYou can either:');
      console.log('1. Delete the existing repository on GitHub and run this script again');
      console.log('2. Or use a different name by editing this script');
    } else {
      console.error('\n❌ Error:', error.message);
    }
  }
}

createRepository();
