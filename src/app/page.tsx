'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2
        style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}
      >
        Effortless travel companion
      </h2>
      <p
        style={{
          fontSize: '16px',
          marginBottom: '30px',
          maxWidth: '600px',
          margin: '0 auto 30px',
        }}
      >
        Save time, eliminate stress, embark confidently, seamless travel
        experience. Start planning now, make every moment count.
      </p>
      <Button size="lg" onClick={() => router.push('/create-trip')}>
        Start Planning Your Adventure
      </Button>
    </div>
  );
}
