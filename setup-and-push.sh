#!/bin/bash

# Set your Git configuration (replace with your actual info)
echo "Setting up Git configuration..."
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Make initial commit
echo "Making initial commit..."
git commit -m "Initial commit: Capstone story project with AWS Lambda functions"

# Add remote origin (replace USERNAME with your GitHub username)
echo "Adding remote origin..."
git remote add origin https://github.com/USERNAME/capstone-project.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Your project should now be on GitHub."