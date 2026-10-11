import DOMPurify from "isomorphic-dompurify";

/** Renders admin HTML safely — sanitized on the server before injection. */
export default function ArticleBody({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    ADD_ATTR: ["target", "rel", "loading"],
  });
  return <div className="article-body" dangerouslySetInnerHTML={{ __html: clean }} />;
}
