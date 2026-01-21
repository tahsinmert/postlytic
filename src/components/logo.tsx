import Image from 'next/image';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 font-bold text-lg text-accent-default">
      <Image
        src="/logo.png"
        alt="Postlytic Logo"
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
        priority
      />
      <span className="font-headline">Postlytic</span>
    </div>
  );
};
