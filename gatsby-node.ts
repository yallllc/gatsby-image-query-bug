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
  // BUG REPRO DETAIL:

  // 1. This query produces the bug, following the README steps

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

  // 2. HOWEVER this query succeeds:
  /* 
  const result = await graphql<{ markdownRemark: { frontmatter: object } }>(`
    {
      markdownRemark(frontmatter: { slug: { eq: "home" } }) {
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
  `);

  const context = result?.data?.markdownRemark?.frontmatter;
 */

  if (!context) {
    return Promise.reject(`query failed ${JSON.stringify(result, null, 2)}`);
  }
  actions.createPage({
    path: "/",
    component: path.resolve(`src/templates/page.tsx`),
    context,
  });
};
