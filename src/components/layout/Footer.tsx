export const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto bg-background border-t">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Stworzone przez Oleksii Sliepov
        </p>
        <a 
          href="https://www.buymeacoffee.com/sliepov" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-90 transition-opacity"
        >
          <img 
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
            alt="Buy Me A Coffee" 
            className="h-[60px] w-[217px]"
          />
        </a>
      </div>
    </footer>
  );
}; 