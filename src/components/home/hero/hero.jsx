import MarkdownIt from "markdown-it";
import {generateRoseyId} from "rosey-cloudcannon-connector/utils"
const md = new MarkdownIt({ html: true });

export default function HomeHero(block) {
  return (
    <section className="hero-two">
      <div className="hero-two-shape"></div>
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-two-content">
              <h1 className="mb-4" data-rosey={generateRoseyId(block.title)}>{block.title}</h1>
              <div
                className="mb-7 w-xxl-80"
                dangerouslySetInnerHTML={{
                  __html: md.render(block.description),
                }}
                data-rosey-ns="rcc-markdown"
                data-rosey-tagger
              />
              <div className="">
                {block.button && (
                  <a
                    href={block.button.link}
                    className="btn btn-primary btn-lg"
                  >
                    {" "}
                    <span data-rosey={generateRoseyId(block.button.text)}>
                      {block.button.text}
                    </span>
                    {" "}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-two-banner">
              <img src={block.image} alt={block.image_alt} />
              <div className="hero-two-banner-shape"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
