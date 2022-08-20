import { GatsbyNode } from "gatsby";
import path from "path";

type QueryBlock<T = object> = { edges: { node: { frontmatter: T } }[] };

/** The bug occurs with or without these typings, but this is how our project is typed */
export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    const { createTypes } = actions;
    const typeDefs = `
      type ImageWAlt {
        image: File @fileByRelativePath
        image_alt: String
      }

      type Components {
        type: String
        heading: String
        image_w_alt: ImageWAlt
      }

      type MarkdownRemarkFrontmatter {
        slug: String!
        components: [Components]
      }
    `;
    createTypes(typeDefs);
  };

export const createPages: GatsbyNode["createPages"] = async ({
  actions,
  graphql,
}) => {
  const { createPage, createRedirect } = actions;

  const result = await graphql<{
    pages: QueryBlock<{ slug: string }>;
  }>(`
    {
      pages: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/.*/cms/content/pages/.*/" } }
      ) {
        edges {
          node {
            frontmatter {
              slug
              components {
                type
                heading
                image_w_alt {
                  image {
                    childImageSharp {
                      gatsbyImageData
                    }
                  }
                  image_alt
                }
              }
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    return Promise.reject(result.errors);
  }
  if (!result.data?.pages?.edges?.length) {
    return Promise.reject("createPages query failed: no data");
  }

  const pageData = result.data.pages.edges.map((e) => e.node.frontmatter);
  pageData.forEach((data) => {
    const pagePath = data.slug === "home" ? "/" : `/${data.slug}/`;
    createPage({
      path: pagePath,
      component: path.resolve(`src/templates/page.tsx`),
      context: data,
    });
  });
};
