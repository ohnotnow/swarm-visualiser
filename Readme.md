# Docker Swarm Visualiser

This is a simple web page that will show you live updates of the containers running in your local swarm.  It was written while a bit bored during the lockdown and is just a re-write of the original
[docker swarm visualizer](https://github.com/dockersamples/docker-swarm-visualizer) using [alpinejs](https://github.com/alpinejs/alpine) and [tailwindcss](https://tailwindcss.com/).

![screenshot](screenshot.png)

## Quick Usage

### Locally

```bash
npm install
node index.js
```

### Docker
```bash
docker build -t vis:0.1 .
docker run -v /var/run/docker.sock:/var/run/docker.sock -p 3000:3000 vis:0.1
```
Or I've built an image and pushed it to Docker Hub that you can use (though you are trusting
it with your docker socket - so beware). https://hub.docker.com/r/ohffs/swarm-visualiser/tags

In either case you should be able to visit http://localhost:3000 in your browser and see the page.

There is also a little bash script you can run by doing `./demo.sh` which will create two services
and scale them randomly between 1-10 containers.

## Development

If you want to change the way things work there are two main files to look at.  `index.js` in the root of the project is the main
nodejs code to set up express and talk to the Docker API.  Then `public/index.html` has the layout/css and front-end javascript.
If you are changing the way things look then you can read up on the [tailwindcss](https://tailwindcss.com/) and [AlpineJS](https://github.com/alpinejs/alpine) docs.  You will also
have to run `npm run dev` to get the full tailwind build so all the classes are available (comes in at about 1mb).  Once you're done
run `npm run prod` to have it run through [PurgeCSS](https://purgecss.com/) and you should be left with about 2-3kb of css instead.
