import { GatsbyNode } from "gatsby";
import path from "path";

/** The bug occurs with or without these typings, but this is similar to how our project is typed */
export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    actions.createTypes(`
      type MarkdownRemarkFrontmatter {
        image: File @fileByRelativePath
        alt: String
      }
    `);
  };

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
}) => {
  const result = await graphql<{
    pages: { edges: { node: { frontmatter: object } }[] };
  }>(`
    {
      pages: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/.*/cms/content/pages/home.md/" }
        }
      ) {
        edges {
          node {
            frontmatter {
              slug
              heading
              image {
                childImageSharp {
                  gatsbyImageData
                }
              }
              alt
            }
          }
        }
      }
    }
  `);

  const context = result.data?.pages.edges?.[0].node.frontmatter;
  if (!context) {
    return Promise.reject(`query failed ${JSON.stringify(result, null, 2)}`);
  }
  actions.createPage({
    path: "/",
    component: path.resolve(`src/templates/page.tsx`),
    context,
  });
};
