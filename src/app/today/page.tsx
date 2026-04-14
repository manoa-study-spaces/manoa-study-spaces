export default function TodayPage() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="p-4 today-spaces">
      <h1>Today&apos;s Spaces</h1>
      <p>{formattedDate}</p>
    </main>
  );
}