import { PageProps as GatsbyPageProps } from "gatsby";
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import React, { FC } from "react";

type PageTemplateProps = GatsbyPageProps<
  object,
  { slug: string; components: Section[] }
>;
type Section = { type: string };
type ImageWithAlt = {
  image: { childImageSharp: { gatsbyImageData: IGatsbyImageData } };
  image_alt: string;
};

type CenteredSection = Section & {
  heading: string;
  image_w_alt: ImageWithAlt;
};

const isCenteredSection = (data): data is CenteredSection =>
  data.type === "centered_section";

const PageTemplate: FC<PageTemplateProps> = ({ pageContext }) => {
  return (
    <>
      <h1>{pageContext.slug}</h1>
      {pageContext.components.map((c) => {
        if (isCenteredSection(c)) {
          const { gatsbyImageData } = c.image_w_alt.image.childImageSharp;
          const image = getImage(gatsbyImageData);
          return (
            <>
              <h2>{c.heading}</h2>
              {image && (
                <GatsbyImage image={image} alt={c.image_w_alt.image_alt} />
              )}
            </>
          );
        }
      })}
    </>
  );
};

export default PageTemplate;
