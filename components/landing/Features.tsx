export default function Features() {
  return (
    <section className="w-full max-w-7xl px-6 py-32">
      <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <span className="font-days text-sm uppercase text-white/40 mb-4">01. Dynamic QR</span>
          <h2 className="font-days text-4xl md:text-6xl uppercase leading-tight mb-8">
            Secured by <br /> Rotation.
          </h2>
          <p className="font-abel text-lg opacity-70 leading-relaxed max-w-md">
            SCAS utilizes rotating QR codes to prevent attendance fraud. Every code is unique, time-sensitive, and encrypted for maximum security.
          </p>
        </div>
        
        <div className="relative aspect-square w-full bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 group">
           <div className="grid grid-cols-4 gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
              {[...Array(16)].map((_, i) => (
                <div key={i} className={`w-8 h-8 ${i % 3 === 0 ? 'bg-white' : 'border border-white'}`}></div>
              ))}
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>

        <div className="md:order-last flex flex-col justify-center">
          <span className="font-days text-sm uppercase text-white/40 mb-4">02. Instant Verification</span>
          <h2 className="font-days text-4xl md:text-6xl uppercase leading-tight mb-8">
            Verify in <br /> Real-time.
          </h2>
          <p className="font-abel text-lg opacity-70 leading-relaxed max-w-md">
            Lecturers can verify attendance instantly through their dashboard. Seamlessly integrated with campus databases for effortless reporting.
          </p>
        </div>

        <div className="relative aspect-[4/5] w-full bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 group">
           <div className="w-48 h-48 border border-white/20 rotate-45 group-hover:rotate-90 transition-transform duration-1000"></div>
           <div className="absolute w-32 h-32 border border-white/40 -rotate-45 group-hover:-rotate-90 transition-transform duration-1000"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        </div>
      </div>
    </section>
  );
}
