#!/bin/bash
cd /home/runner/workspace
git add app/(dashboard)/calculator/page.tsx
git commit -m "Fix ESLint error: escape quotes in calculator page for Vercel deployment"
echo "Commit created successfully!"
