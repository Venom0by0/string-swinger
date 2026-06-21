import React, { useState, useEffect, useCallback } from 'react';

function App() {
  // ---------- CORE CONFIG STATE ----------
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [generatedString, setGeneratedString] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('dark'); // 'dark' = deep ocean, 'light' = clear sky

  // ---------- GENERATOR (useCallback) ----------
  const generateStringMatrix = useCallback(() => {
    let pool = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) pool += '0123456789';
    if (includeSymbols) pool += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (pool.length === 0) {
      setGeneratedString('Select at least one character type');
      return;
    }

    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    setGeneratedString(pass);
    setHistory((prev) => [pass, ...prev].slice(0, 5));
  }, [length, includeNumbers, includeSymbols, includeUppercase]);

  // ---------- AUTO-GENERATE (useEffect) ----------
  useEffect(() => {
    generateStringMatrix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, includeNumbers, includeSymbols, includeUppercase]);

  const copyToClipboard = (value = generatedString) => {
    if (value.startsWith('Select at least')) return;
    window.navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const isDark = theme === 'dark';

  // ---------- SYNC BODY BACKGROUND (useEffect) ----------
  // Without this, the browser's default white background shows through
  // on overscroll / if content is taller than the viewport.
  useEffect(() => {
    document.body.style.background = isDark ? '#020305' : '#f8fafc';
    document.body.style.margin = '0';
    return () => {
      document.body.style.background = '';
    };
  }, [isDark]);

  // ---------- STRENGTH SCORE ----------
  const strength = (() => {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 16) score++;
    if (includeUppercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;
    if (score <= 2) return { label: 'Weak', dark: '#e8856b', light: '#c4684f' };
    if (score <= 4) return { label: 'Solid', dark: '#7fc4e0', light: '#3d8fb0' };
    return { label: 'Strong', dark: '#5ad4c8', light: '#1f9e8f' };
  })();
  const strengthColor = isDark ? strength.dark : strength.light;
  const strengthWidth = strength.label === 'Weak' ? '33%' : strength.label === 'Solid' ? '66%' : '100%';

  const toggles = [
    { key: 'uppercase', label: 'Uppercase', sample: 'A B C', checked: includeUppercase, set: setIncludeUppercase },
    { key: 'numbers', label: 'Numbers', sample: '0 1 2', checked: includeNumbers, set: setIncludeNumbers },
    { key: 'symbols', label: 'Symbols', sample: '# $ %', checked: includeSymbols, set: setIncludeSymbols },
  ];

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 antialiased transition-colors duration-500 ${
        isDark
          ? 'bg-[#020305] selection:bg-[#3d7ea6]/30 selection:text-[#cfeaf7]'
          : 'bg-[#f8fafc] selection:bg-[#3d7ea6]/20 selection:text-[#1c3a4c]'
      }`}
      style={{ fontFamily: "'Kalam', cursive" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');`}</style>
      {/* Ambient glow pods */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full blur-[110px] transition-colors duration-500"
        style={{ background: isDark ? 'rgba(61,142,191,0.35)' : 'rgba(90,170,210,0.25)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full blur-[120px] transition-colors duration-500"
        style={{ background: isDark ? 'rgba(99,102,241,0.22)' : 'rgba(129,140,248,0.18)' }}
      />
      <div
        className="pointer-events-none absolute top-1/3 right-10 h-64 w-64 rounded-full blur-[100px] transition-colors duration-500"
        style={{ background: isDark ? 'rgba(90,212,200,0.12)' : 'rgba(90,212,200,0.18)' }}
      />

      {/* Faint grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-size-[3.5rem_3.5rem] transition-opacity duration-500"
        style={{
          backgroundImage: `linear-gradient(to right, ${isDark ? '#ffffff08' : '#00000008'} 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? '#ffffff08' : '#00000008'} 1px, transparent 1px)`,
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Theme toggle, in-flow so it never overlaps the title on small screens */}
        <div className="mb-3 flex justify-end">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 ${
              isDark
                ? 'border-[#3d7ea6]/30 bg-[#070b14]/90 text-[#7fc4e0] hover:border-[#5ad4c8]/60'
                : 'border-[#bcd6e6] bg-white/80 text-[#2c5a73] hover:border-[#3d8fb0]/60'
            }`}
          >
            {isDark ? 'Daylight' : 'Nightfall'}
          </button>
        </div>

        {/* App name, outside the card */}
        <div className="mb-4 flex items-center justify-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ background: isDark ? '#5ad4c8' : '#3d8fb0' }}
            />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: isDark ? '#5ad4c8' : '#3d8fb0' }} />
          </span>
          <h1 className={`text-xl sm:text-2xl font-bold tracking-wide ${isDark ? 'text-[#e6f2f8]' : 'text-[#1c3a4c]'}`}>
            String<span style={{ color: isDark ? '#7fc4e0' : '#3d8fb0' }}> </span>Swinger
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-px transition-all duration-500"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(61,142,191,0.5), rgba(99,102,241,0.3), rgba(90,212,200,0.3))'
              : 'linear-gradient(135deg, rgba(90,170,210,0.6), rgba(129,140,248,0.35), rgba(90,212,200,0.35))',
            boxShadow: isDark ? '0 25px 60px -15px rgba(20,40,70,0.5)' : '0 25px 50px -15px rgba(60,100,140,0.18)',
          }}
        >
          <div
            className={`relative rounded-2xl p-6 backdrop-blur-xl transition-colors duration-500 md:p-8 ${
              isDark ? 'bg-[#070b14]/95' : 'bg-white/95'
            }`}
          >
            {/* Corner brackets */}
            {['top-0 left-0 border-t-2 border-l-2 rounded-tl-lg', 'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg', 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg', 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg'].map((pos) => (
              <div
                key={pos}
                className={`pointer-events-none absolute h-5 w-5 ${pos} transition-colors duration-500`}
                style={{ borderColor: isDark ? '#5ad4c888' : '#3d8fb055' }}
              />
            ))}

            {/* Header */}
            <div className={`mb-6 flex items-center justify-end border-b pb-4 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
              <span className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-[#4a5a6e]' : 'text-[#8aa6b8]'}`}>v6.0</span>
            </div>

            {/* Output display */}
            <div className="group relative mb-4">
              <div
                className={`min-h-15 w-full break-all rounded-xl border p-4 pr-18 text-[15px] font-semibold tracking-wide shadow-inner transition-colors duration-300 ${
                  isDark ? 'border-[#3d7ea6]/25 bg-black/30 text-[#dbeef7]' : 'border-[#bcd6e6] bg-[#f3f8fb] text-[#1c3a4c]'
                }`}
              >
                {generatedString}
              </div>
              <button
                onClick={() => copyToClipboard()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-150 ${
                  copied
                    ? isDark
                      ? 'border-[#5ad4c8]/60 bg-[#5ad4c8]/10 text-[#5ad4c8]'
                      : 'border-[#1f9e8f]/50 bg-[#1f9e8f]/10 text-[#1f9e8f]'
                    : isDark
                    ? 'border-[#3d7ea6]/25 bg-[#3d7ea6]/5 text-[#a9d8ec] hover:border-[#5ad4c8]/40 hover:text-white'
                    : 'border-[#3d8fb0]/40 bg-[#3d8fb0]/5 text-[#2c5a73] hover:border-[#1c3a4c]/40 hover:text-[#1c3a4c]'
                }`}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Strength meter */}
            <div className="mb-6 flex items-center gap-3">
              <div className={`h-1.5 flex-1 overflow-hidden rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: strengthWidth, background: strengthColor, boxShadow: `0 0 10px ${strengthColor}88` }}
                />
              </div>
              <span className="w-12 text-right text-[10px] font-bold uppercase tracking-wider" style={{ color: strengthColor }}>
                {strength.label}
              </span>
            </div>

            {/* Config panel */}
            <div className={`space-y-5 rounded-xl border p-5 ${isDark ? 'border-[#3d7ea6]/15 bg-white/2' : 'border-[#bcd6e6]/60 bg-[#f3f8fb]'}`}>
              {/* Length slider */}
              <div className="flex flex-col gap-2">
                <div className={`flex items-center justify-between text-[11px] tracking-wide ${isDark ? 'text-[#8aa6b8]' : 'text-[#5a7a8c]'}`}>
                  <span>LENGTH</span>
                  <span
                    className="rounded-md px-2 py-0.5 font-bold"
                    style={{ background: isDark ? 'rgba(61,142,191,0.12)' : 'rgba(61,142,176,0.1)', color: isDark ? '#7fc4e0' : '#2c5a73' }}
                  >
                    {length.toString().padStart(2, '0')}
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={32}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className={`h-1.5 w-full cursor-pointer appearance-none rounded-full ${isDark ? 'bg-white/10 accent-[#5ad4c8]' : 'bg-black/10 accent-[#3d8fb0]'}`}
                />
              </div>

              {/* Toggle pills */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {toggles.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => t.set((prev) => !prev)}
                    className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-center transition-all ${
                      t.checked
                        ? isDark
                          ? 'border-[#6366f1]/40 bg-[#6366f1]/10 text-[#a5b4fc]'
                          : 'border-[#6366f1]/40 bg-[#6366f1]/10 text-[#4338ca]'
                        : isDark
                        ? 'border-white/5 bg-transparent text-[#4a5a6e] hover:border-white/10 hover:text-[#8aa6b8]'
                        : 'border-black/5 bg-transparent text-[#8aa6b8] hover:border-black/10 hover:text-[#2c5a73]'
                    }`}
                  >
                    <span className="font-mono text-[10px] tracking-wide opacity-80">{t.sample}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Regenerate */}
            <button
              onClick={generateStringMatrix}
              className="mt-6 w-full rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
              style={{
                background: isDark ? 'linear-gradient(90deg, #3d7ea6, #6366f1)' : 'linear-gradient(90deg, #3d8fb0, #6366f1)',
                color: '#ffffff',
                boxShadow: isDark ? '0 4px 20px rgba(61,142,191,0.3)' : '0 4px 20px rgba(61,142,176,0.25)',
              }}
            >
              Regenerate
            </button>

            {/* History */}
            {history.length > 1 && (
              <div className={`mt-6 border-t pt-4 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                <p className={`mb-2 text-[10px] uppercase tracking-widest ${isDark ? 'text-[#4a5a6e]' : 'text-[#8aa6b8]'}`}>Recent</p>
                <div className="space-y-1">
                  {history.slice(1).map((item, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(item)}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[11px] transition-colors ${
                        isDark ? 'text-[#6b7f94] hover:bg-[#3d7ea6]/5 hover:text-[#a9d8ec]' : 'text-[#8aa6b8] hover:bg-[#3d7ea6]/5 hover:text-[#2c5a73]'
                      }`}
                    >
                      <span className="truncate font-mono">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className={`mt-5 text-center text-[9px] uppercase tracking-widest ${isDark ? 'text-[#3a4654]' : 'text-[#a8bdc9]'}`}>
          Generated locally in your browser — nothing leaves this page
        </footer>
      </div>
    </div>
  );
}

export default App;
