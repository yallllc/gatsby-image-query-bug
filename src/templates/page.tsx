import { PageProps as GatsbyPageProps } from "gatsby";
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import React, { FC } from "react";

type PageTemplateProps = GatsbyPageProps<
  object,
  {
    heading: string;
    image: { childImageSharp: { gatsbyImageData: IGatsbyImageData } };
    alt: string;
  }
>;

const PageTemplate: FC<PageTemplateProps> = ({ pageContext }) => {
  const { gatsbyImageData } = pageContext.image.childImageSharp;
  const image = getImage(gatsbyImageData);
  return (
    <>
      <h2>{pageContext.heading}</h2>
      {image && <GatsbyImage image={image} alt={pageContext.alt} />}
    </>
  );
};

export default PageTemplate;
