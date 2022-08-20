# Gatsby GraphQL Image Query Bug Repro

The Gatsby graph fails to query images in certain situations in a Netlify CMS project.

#### Repro Steps:

- `yarn` and `yarn develop`, the image will load fine in the dev server.
- Open [GraphiQL](http://localhost:8000/___graphql) and paste the query from gatsby-node.ts
- Bug! You'll see `"image": null` in GraphiQL.

#### Bug behavior:

- Now open the file `src/cms/content/pages/home.md` and change the `type: centered_section`
  to any other string -- the GraphiQL query succeeds!
- It will continue to succeed after a change is made, even if you change it back.

![screenshot](./null-image-bug.png)

#### Build notes:

- Local builds never fail.
- But Netlify builds _do_ exhibit the error, with a certain quirk. (They succeed when built
  fresh but fail on cached rebuilds.) This is a new problem, builds worked on Gatsby 3.

#### Setup notes:

- Uses the `gatsby-transformer-remark` plugin with the community plugin `gatsby-remark-relative-images`,
  a workaround to fix relative image pathing from `static/`, something Netlify CMS doesn't handle.
- An issue has been opened with the author of that plugin, but this problem arose at Gatsby 4.
