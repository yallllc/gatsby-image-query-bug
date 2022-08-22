# Gatsby GraphQL Image Query Bug Repro

The Gatsby graph fails to query images in certain situations in a Netlify CMS project.

#### Repro Steps:

- `yarn`, `yarn develop`, open [this GraphiQL query](<http://localhost:8000/___graphql?query=%7B%0A%20%20pages%3A%20allMarkdownRemark(%0A%20%20%20%20filter%3A%20%7B%0A%20%20%20%20%20%20fileAbsolutePath%3A%20%7B%0A%20%20%20%20%20%20regex%3A%20%22%2F.*%2Fcms%2Fcontent%2Fpages%2Fhome.md%2F%22%0A%20%20%20%20%7D%0A%20%20%7D)%20%7B%0A%20%20%20%20edges%20%7B%0A%20%20%20%20%20%20node%20%7B%0A%20%20%20%20%20%20%20%20frontmatter%20%7B%0A%20%20%20%20%20%20%20%20%20%20slug%0A%20%20%20%20%20%20%20%20%20%20heading%0A%20%20%20%20%20%20%20%20%20%20image%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20childImageSharp%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20gatsbyImageData%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20alt%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D>)
  (or paste the `createPages` query from gatsby-node.ts)
- Bug! You'll see `"image": null` in GraphiQL.
- Open [home.md](src/cms/content/pages/home.md) and make any change to `heading` or `alt`
  -- GraphiQL query succeeds!
- Restarting the dev server will reset the bug state

![screenshot](./null-image-bug.png)

#### Build notes:

- Local builds never fail.
- But Netlify builds _do_ exhibit the error, with a certain quirk. (They succeed when built
  fresh but fail on cached rebuilds.) This is a new problem, builds worked on Gatsby 3.

#### Setup notes:

- Uses the `gatsby-transformer-remark` plugin with the community plugin `gatsby-remark-relative-images`,
  a workaround to fix relative image pathing from `static/`, something Netlify CMS doesn't handle.
- An issue has been opened with the author of that plugin, but this problem arose at Gatsby 4.
