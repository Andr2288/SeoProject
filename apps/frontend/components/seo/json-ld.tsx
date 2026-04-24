/**
 * Вбудовує JSON-LD для Google та інших систем, що читають Schema.org.
 * Дані мають бути серіалізовані в JSON без небезпечних рядків у ключах.
 */
export default function JsonLd(props: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(props.data) }}
    />
  );
}
