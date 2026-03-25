type PagePlaceholderProps = {
  title: string;
  description: string;
};

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section className="page-placeholder">
      <h2 className="page-placeholder__title">{title}</h2>
      <p className="page-placeholder__desc">{description}</p>
      <p className="page-placeholder__hint">
        Front-end shell only — connect APIs when you are ready to integrate the back end.
      </p>
    </section>
  );
}
