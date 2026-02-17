import { CreatePollForm } from "@/components/CreatePollForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md text-center mb-10 space-y-4">
        <div className="inline-block p-3 bg-card rounded-2xl shadow-sm mb-4 border border-border">
          <span className="text-2xl">📊</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Poll Rooms
        </h1>
        <p className="text-lg text-muted-foreground max-w-[80%] mx-auto leading-relaxed">
          Create instant, anonymous polls. <br />
          Real-time results. No signup required.
        </p>
      </div>

      <div className="w-full max-w-5xl animate-in slide-in-from-bottom-4 duration-700">
        <CreatePollForm />
      </div>

      <footer className="mt-16 text-sm text-muted-foreground/60 font-medium">
        <p>© {new Date().getFullYear()} Poll Rooms • Simplicity First</p>
      </footer>
    </main>
  );
}
