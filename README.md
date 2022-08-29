# Gatsby GraphQL Image Query Bug Repro

The Gatsby graph fails to query images in certain situations in a Netlify CMS project.

#### Repro Steps:

- `yarn`
- `yarn clean && yarn build`
  - succeeds with image
- `yarn build` (again, this uses the cache)
  - fails on `null` image (`TypeError: Cannot read properties of null (reading 'childImageSharp')`)
- `yarn clean && yarn develop`
  - image succeeds in frontend app
  - image is `null` in GraphiQL
  - changing text in [home.md](src/cms/content/pages/home.md) makes GraphiQL work
- Stop development server
- `yarn develop` (again, this uses the cache)
  - fails on `null` image in frontend & GraphiQL
  - changing text in home.md makes frontend & GraphiQL work

Netlify builds exhibit this same behavior: they work on fresh build but fail on cached builds.

The same setup worked fine on Gatsby 3, the bug is specific to Gatsby 4. This project uses the `gatsby-transformer-remark`
plugin, plus the community plugin `gatsby-remark-relative-images`, which might potentially be causing this caching problem.

Full [GraphiQL query](<http://localhost:8000/___graphql?query=%7B%0A%20%20pages%3A%20allMarkdownRemark(%0A%20%20%20%20filter%3A%20%7B%0A%20%20%20%20%20%20fileAbsolutePath%3A%20%7B%0A%20%20%20%20%20%20regex%3A%20%22%2F.*%2Fcms%2Fcontent%2Fpages%2Fhome.md%2F%22%0A%20%20%20%20%7D%0A%20%20%7D)%20%7B%0A%20%20%20%20edges%20%7B%0A%20%20%20%20%20%20node%20%7B%0A%20%20%20%20%20%20%20%20frontmatter%20%7B%0A%20%20%20%20%20%20%20%20%20%20slug%0A%20%20%20%20%20%20%20%20%20%20heading%0A%20%20%20%20%20%20%20%20%20%20image%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20childImageSharp%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20gatsbyImageData%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20alt%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D>)

An alternate query in `gatsby-node.ts` that doesn't use `allMarkdownRemark` doesn't exhibit this bug.
Uncomment and re-run the steps above using the alternate query to verify.

![screenshot](./null-image-bug.png)
