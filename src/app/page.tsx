"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { KanbanSquare, BrainCircuit, Blocks, Sparkles, Move, Users, ShieldCheck, Zap, Lock } from 'lucide-react';

const LandingHeader = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
    <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <KanbanSquare className="h-6 w-6 text-primary" />
        <span>TaskFlow</span>
      </Link>
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link>
        <Link href="#testimonials" className="text-muted-foreground hover:text-foreground">Testimonials</Link>
        <Link href="/login" className="text-muted-foreground hover:text-foreground">Documentation</Link>
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Get Started</Link>
        </Button>
      </div>
    </div>
  </header>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <Card className="text-center flex flex-col items-center p-4 bg-card/50">
        <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                {icon}
            </div>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const TestimonialCard = ({ name, role, text, avatarSrc }: { name: string, role: string, text: string, avatarSrc: string }) => (
    <Card className="p-6 h-full">
        <CardContent className="p-0 flex flex-col h-full">
            <blockquote className="text-muted-foreground flex-grow">"{text}"</blockquote>
            <div className="mt-4 flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={avatarSrc} alt={name} data-ai-hint="person portrait"/>
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-muted-foreground">{role}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const LandingFooter = () => (
    <footer className="bg-muted">
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <KanbanSquare className="h-6 w-6 text-primary" />
                    <span>TaskFlow</span>
                </div>
                <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
                <div className="flex gap-4">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
                </div>
            </div>
        </div>
    </footer>
);

export default function RootPage() {
  return (
    <div className="bg-background text-foreground">
      <LandingHeader />
      <main className="mt-16">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-radial-gradient-primary" />
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div
              className="bg-primary/10 text-primary border border-primary/20 inline-block rounded-full px-4 py-1.5 text-sm font-semibold mb-4 shadow-sm animate-fade-in-up"
            >
              Supercharged with Generative AI
            </div>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 animate-fade-in-up [animation-delay:0.2s]"
            >
              From Chaos to Clarity, Instantly.
            </h1>
            <p
              className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in-up [animation-delay:0.3s]"
            >
              TaskFlow is the intelligent project manager that uses AI to automate your workflow, structure your tasks, and bring focus to your team. Go from idea to execution, faster than ever before.
            </p>
            <div
              className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up [animation-delay:0.4s]"
            >
              <Button size="lg" asChild className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300">
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-background/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Visual App Preview Section */}
        <section className="container mx-auto px-4 md:px-6 mb-20 md:mb-32">
            <div className="relative rounded-xl shadow-2xl overflow-hidden border">
                <Image 
                    src="https://dev.inktagon.com/fileupload/taskflow-banner-2.png"
                    alt="TaskFlow application interface showing a Kanban board with AI-generated tasks and images"
                    width={1920}
                    height={1080}
                    className="w-full"
                    data-ai-hint="app interface"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
            </div>
        </section>

         {/* The TaskFlow Difference Section */}
        <section className="py-20 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Effortless Speed</h3>
                        <p className="text-muted-foreground">From natural language input to AI-generated tasks, we eliminate friction so you can move faster.</p>
                    </div>
                     <div className="flex flex-col items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <BrainCircuit className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Built-in Intelligence</h3>
                        <p className="text-muted-foreground">Our AI doesn't just fill fields; it helps you strategize, prioritize, and break down complex work.</p>
                    </div>
                     <div className="flex flex-col items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Lock className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Ultimate Privacy</h3>
                        <p className="text-muted-foreground">Your data stays with you. TaskFlow runs in your browser with no cloud sync or external servers.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-24 bg-muted">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Everything you need to be productive</h2>
                    <p className="max-w-xl mx-auto text-muted-foreground mt-4">
                        TaskFlow combines powerful task management with delightful AI features to keep you and your projects on track.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<Sparkles className="h-6 w-6" />}
                        title="AI Smart Create"
                        description="Just provide a title. Our AI assistant generates a full task brief, including a detailed description, priority level, actionable subtasks, and even a custom cover image."
                    />
                    <FeatureCard 
                        icon={<Move className="h-6 w-6" />}
                        title="Intuitive Kanban Board"
                        description="Visually organize your work with a simple drag-and-drop interface. Get an instant overview of your project's progress from 'To Do' to 'Done'."
                    />
                    <FeatureCard 
                        icon={<BrainCircuit className="h-6 w-6" />}
                        title="Intelligent Prioritization"
                        description="Click 'Smart Sort' and let AI analyze your tasks for urgency and importance, re-prioritizing your list so you can focus on what matters most."
                    />
                     <FeatureCard 
                        icon={<Blocks className="h-6 w-6" />}
                        title="Rich Task Details"
                        description="Go beyond a simple to-do. Add due dates, checklists, cover images, and detailed descriptions to keep all your project information in one place."
                    />
                     <FeatureCard 
                        icon={<Users className="h-6 w-6" />}
                        title="Multiple Project Views"
                        description="Switch between a high-level Dashboard, a deadline-driven Calendar, and the classic Board view to get the perfect perspective on your work."
                    />
                     <FeatureCard 
                        icon={<ShieldCheck className="h-6 w-6" />}
                        title="Private & Secure by Design"
                        description="Your data is yours alone. TaskFlow runs entirely in your browser, using local storage for privacy and security. No cloud accounts needed."
                    />
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Loved by productive people</h2>
                    <p className="max-w-xl mx-auto text-muted-foreground mt-4">
                        Don't just take our word for it. Here's what our users are saying about TaskFlow.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TestimonialCard 
                        name="Sarah Johnson"
                        role="Creative Director"
                        text="The AI Smart Create feature is mind-blowing. It saves me hours of administrative work every week and lets my team focus on the actual creative tasks."
                        avatarSrc="https://placehold.co/100x100.png"
                    />
                    <TestimonialCard 
                        name="Michael Chen"
                        role="Freelance Developer"
                        text="As a freelancer, I juggle multiple projects. The 'Smart Sort' feature is my secret weapon for staying on top of deadlines and priorities. I can't imagine my workflow without it."
                        avatarSrc="https://placehold.co/100x100.png"
                    />
                    <TestimonialCard 
                        name="Emily Rodriguez"
                        role="Startup Founder"
                        text="TaskFlow brought immediate clarity to our startup. The Kanban board is incredibly intuitive, and seeing our entire workflow visually has improved our team's alignment and speed."
                        avatarSrc="https://placehold.co/100x100.png"
                    />
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 md:py-24 bg-muted">
            <div className="container mx-auto px-4 md:px-6 text-center">
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">
                    Reclaim your focus. Transform your productivity.
                </h2>
                <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-8">
                    Join thousands of productive individuals and teams. Get started with TaskFlow for free and experience the future of task management.
                </p>
                <Button size="lg" asChild>
                    <Link href="/signup">Start for Free Now</Link>
                </Button>
            </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
