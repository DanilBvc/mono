import Link from 'next/link';
import React from 'react';

function Page() {
  return (
    <div>
      Welcome <Link href={'/home'}>home</Link>
    </div>
  );
}

export default Page;
