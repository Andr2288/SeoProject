import Container from './container';

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <Container className="py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} IT Blog MVP
      </Container>
    </footer>
  );
}