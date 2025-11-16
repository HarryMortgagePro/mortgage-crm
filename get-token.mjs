let connectionSettings;

async function getAccessToken() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
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

  if (!accessToken) {
    throw new Error('GitHub not connected');
  }
  
  console.log('\n✅ Your GitHub is connected! Use these commands:\n');
  console.log('git remote remove origin 2>/dev/null || true');
  console.log(`git remote add origin https://${accessToken}@github.com/HarryMortgagePro/mortgage-crm.git`);
  console.log('git push -u origin main --force');
  console.log('\n📋 Copy and paste each command above into the Shell!\n');
}

getAccessToken();
