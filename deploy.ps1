# Build the project
yarn run build
 
# Move into dist folder
Set-Location "build"
 
# Publish to Domo
domo publish
 
# Return back to root
Set-Location ".."