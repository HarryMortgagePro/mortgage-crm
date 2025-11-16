import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

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

async function pushToGitHub() {
  try {
    console.log('🔐 Getting GitHub access token...');
    const token = await getAccessToken();
    
    const octokit = new Octokit({ auth: token });
    const { data: user } = await octokit.users.getAuthenticated();
    
    console.log(`✓ Authenticated as: ${user.login}\n`);
    
    const repoUrl = `https://${token}@github.com/${user.login}/mortgage-crm.git`;
    
    console.log('📝 Configuring git...');
    execSync(`git config --global user.email "${user.email || user.login + '@users.noreply.github.com'}"`, { stdio: 'inherit' });
    execSync(`git config --global user.name "${user.login}"`, { stdio: 'inherit' });
    
    console.log('\n📦 Adding files...');
    execSync('git add .', { stdio: 'inherit' });
    
    console.log('\n💾 Creating commit...');
    try {
      execSync('git commit -m "Full-featured Mortgage CRM with Property Library"', { stdio: 'inherit' });
    } catch (err) {
      console.log('ℹ️  No new changes to commit');
    }
    
    console.log('\n🌿 Setting up branch...');
    execSync('git branch -M main', { stdio: 'inherit' });
    
    console.log('\n🔗 Configuring remote...');
    try {
      execSync('git remote remove origin 2>/dev/null', { stdio: 'pipe' });
    } catch (err) {
      // Ignore if remote doesn't exist
    }
    execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' });
    
    console.log('\n🚀 Pushing to GitHub...');
    execSync('git push -u origin main --force', { stdio: 'inherit' });
    
    console.log(`\n✅ Success! Your code is now on GitHub:`);
    console.log(`   https://github.com/${user.login}/mortgage-crm\n`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

pushToGitHub();
