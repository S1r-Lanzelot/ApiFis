## Solution:

- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
- Component library utilized is [Mui](https://mui.com/).

## Design considerations:

The project uses React v17 and NextJs v12 primarily because this is what I have been using over the last year. The newer version (v13) of NextJs has introduced some great features however I would like more time to study them before implementing a solution with it. I like NextJs because it streamlines a lot of the development and allows you to get going quickly, with such things as routing, hot reload, and serverless api support to name a few.

I think this project could have benefited from using SSR, primarily it would have mitigated the necessity of a proxy backend api due to CORS constraints. However, based on the filtering needs and the ease of adding a backend api route, I decided to go with CSR.

Overall, I am happy with the outcome of this solution, I think the UI/design could use improvement. I tried to structure this project in a way to support additional pages and growth. If I had more time with the project I would have considered going with an SSR solution and/or instead of using NextJS "serverless" api, I would have stood up a dedicated backend solution.

## SkiFree assets:

I am not sure if you are familiar with the SkiFree Windows game from the 1990s, but I decided to have some fun with this project by using the monster from that game as the loader gif and the logo as the favicon. Credits to [https://ski.ihoc.net/](SkiFree) by Chris Pirih.

## Running locally if you have node installed

Run the development server locally:

```bash
cd api-fis
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the website.

## Running via Docker

Run the development server via docker:

```bash
docker-compose up
```

_NOTE: I have noticed that the docker version compiles much more slowly and hot reload does not work. I have experienced this before with nextjs. Usually, I will run the front end on my host. This would be an area that I would need to investigate further._

Open [http://localhost:3000](http://localhost:3000) with your browser to see the website.
