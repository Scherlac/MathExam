#!/bin/env pwsh

# serve the app with nginx
docker run -it --rm -v ${PSScriptRoot}:/usr/share/nginx/html:ro -p 8080:80 nginx



