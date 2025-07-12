import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
    KanbanSquare, 
    BrainCircuit, 
    Wand2, 
    Sparkles, 
    LayoutDashboard, 
    Calendar, 
    Bell, 
    Search, 
    Volume2,
    Palette,
    MousePointerClick,
    Eye,
    Lock,
    Users
} from 'lucide-react';

const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    </div>
);


export default function DocumentationPage() {
    return (
        <div className="container mx-auto max-w-5xl p-4 md:p-8 space-y-8">
            <header className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">TaskFlow Documentation</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Welcome to the official guide for TaskFlow. This page provides a comprehensive overview of all the features designed to supercharge your productivity.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <KanbanSquare className="h-7 w-7 text-primary" />
                        The Kanban Board
                    </CardTitle>
                    <CardDescription>The heart of your workflow, designed for clarity and control. Organize your work visually and track progress with ease.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 text-sm">
                   <FeatureItem 
                        icon={<MousePointerClick className="h-5 w-5" />}
                        title="Drag & Drop Interface"
                        description="Intuitively move tasks between the 'To Do', 'In Progress', and 'Done' columns. Just click and hold a task card, then drag it to a new column to update its status instantly."
                   />
                   <FeatureItem 
                        icon={<Search className="h-5 w-5" />}
                        title="Powerful Filtering & Searching"
                        description="Quickly find any task using the global search bar, or use the 'Filters' button to narrow your view by priority (High, Medium, Low) or due date (Overdue, Today, This Week)."
                   />
                   <FeatureItem 
                        icon={<Eye className="h-5 w-5" />}
                        title="Compact & Full View"
                        description="Toggle the compact view switch to reduce the size of task cards, hiding descriptions and footers. This gives you a high-level overview of all your tasks at a glance."
                   />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <BrainCircuit className="h-7 w-7 text-primary" />
                        AI-Powered Productivity
                    </CardTitle>
                    <CardDescription>Leverage the power of generative AI to work smarter, not harder. Click each feature to learn more about how it works.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="smart-sort">
                            <AccordionTrigger>
                                <div className="flex items-center gap-3 font-semibold text-left">
                                    <BrainCircuit className="h-5 w-5 text-primary" />
                                    Smart Sort
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Feeling overwhelmed? Click the "Smart Sort" button on the Board page. The AI analyzes all your 'To Do' and 'In Progress' tasks, looking at titles and descriptions for keywords like "urgent," "fix," or "plan." It then re-assigns a priority (High, Medium, or Low) to each task to help you focus on what matters most.
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="smart-create">
                            <AccordionTrigger>
                                <div className="flex items-center gap-3 font-semibold text-left">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    Smart Create
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Turn a simple idea into a complete task. Just type a title in the "New Task" dialog and click "AI Smart Create." In seconds, AI will generate a detailed description, determine an appropriate priority, break the work down into actionable subtasks, and even create a relevant, professional cover image.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="quick-add">
                            <AccordionTrigger>
                                <div className="flex items-center gap-3 font-semibold text-left">
                                    <Wand2 className="h-5 w-5 text-primary" />
                                    Quick Add with Natural Language
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Use the <Sparkles className="inline-block h-4 w-4" /> popover in the header to create tasks effortlessly. Type a phrase like "Deploy app next Friday high priority" or "Research competitors by end of week". The AI parses your text to set the title, due date, and priority automatically.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="ai-content">
                            <AccordionTrigger>
                                <div className="flex items-center gap-3 font-semibold text-left">
                                    <Palette className="h-5 w-5 text-primary" />
                                    On-Demand Content Generation
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Stuck on a task? Inside the "New Task" or "Task Details" dialogs, use the "Generate with AI" button to create a task description or a cover image from the title. Use the "Suggest with AI" button to get a list of relevant subtasks.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="ai-insights">
                            <AccordionTrigger>
                                <div className="flex items-center gap-3 font-semibold text-left">
                                    <LayoutDashboard className="h-5 w-5 text-primary" />
                                     AI Insights & Audio Summary
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Visit the Dashboard to get a short, motivational summary of your progress based on your task statistics. For a hands-free update, click the <Volume2 className="inline-block h-4 w-4" /> icon to listen to the summary as audio.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                           <Eye className="h-7 w-7 text-primary" />
                            Application Views & UX
                        </CardTitle>
                        <CardDescription>Visualize your work from different angles and enjoy a seamless experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <FeatureItem 
                            icon={<LayoutDashboard className="h-5 w-5" />}
                            title="Dashboard"
                            description="Get a high-level overview of your productivity with charts for task status and priority, statistic cards, and lists of upcoming or overdue tasks."
                        />
                        <FeatureItem 
                            icon={<Calendar className="h-5 w-5" />}
                            title="Calendar"
                            description="See all your tasks with due dates in a full-page calendar. Click any day to view a list of all tasks due on that specific date."
                        />
                         <FeatureItem 
                            icon={<Bell className="h-5 w-5" />}
                            title="Notifications / Activity Feed"
                            description="The notification center provides a chronological history of your activity. See when tasks are created, updated, or completed in a single feed."
                        />
                        <FeatureItem 
                            icon={<Search className="h-5 w-5" />}
                            title="Command Palette"
                            description="Press <Badge variant='secondary'>⌘K</Badge> or <Badge variant='secondary'>Ctrl+K</Badge> to open a powerful search bar. Instantly find and navigate to any task."
                        />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                           <Lock className="h-7 w-7 text-primary" />
                            Authentication & Data
                        </CardTitle>
                        <CardDescription>Your data is secure, private, and always available.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <FeatureItem 
                            icon={<Users className="h-5 w-5" />}
                            title="Secure User Authentication"
                            description="Create an account using your email and password or sign in instantly with your Google account. All authentication is handled securely by Firebase."
                        />
                        <FeatureItem 
                            icon={<Lock className="h-5 w-5" />}
                            title="User-Scoped Data Storage"
                            description="All your task and notification data is saved directly in your browser's local storage. It's tied to your unique user ID, ensuring your data is completely private and separate."
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
