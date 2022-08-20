import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `gatsby-image-query-bug`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/static`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/cms/content`,
      },
    },
    { resolve: `gatsby-plugin-image` },
    { resolve: `gatsby-transformer-sharp` },
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, "webp", "avif"],
          placeholder: `dominantColor`,
          quality: 60,
          breakpoints: [768, 1024, 1280, 1536],
        },
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-relative-images`,
            options: { staticFolderName: "static" },
          },
          {
            resolve: `gatsby-remark-images`,
            options: { maxWidth: 2048 },
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-netlify-cms",
    },
  ],
};

export default config;
