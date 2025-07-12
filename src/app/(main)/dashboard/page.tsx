
"use client";

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { useTasks } from '@/hooks/use-tasks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ListTodo, Loader2, AlertTriangle, Goal, CalendarClock, Wand2, Volume2 } from 'lucide-react';
import { isPast, isFuture, differenceInDays, formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task, Priority } from '@/lib/types';
import { generateDashboardSummary } from '@/ai/flows/generate-dashboard-summary';
import { generateAudioSummary } from '@/ai/flows/generate-audio-summary';


const statusChartConfig = {
  count: {
    label: 'Count',
  },
  "To Do": {
    label: 'To Do',
    color: 'hsl(var(--chart-1))',
  },
  "In Progress": {
    label: 'In Progress',
    color: 'hsl(var(--chart-2))',
  },
  "Done": {
    label: 'Done',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const priorityChartConfig = {
  tasks: {
    label: 'Tasks',
  },
  High: {
    label: 'High',
    color: 'hsl(var(--chart-1))',
  },
  Medium: {
    label: 'Medium',
    color: 'hsl(var(--chart-4))',
  },
  Low: {
    label: 'Low',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const priorityStyles: Record<Priority, string> = {
  High: "text-destructive border-destructive/30 bg-destructive/10",
  Medium: "text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/30 bg-[hsl(var(--chart-4))]/10",
  Low: "text-muted-foreground border-border bg-muted",
};

const TaskListItem = ({ task }: { task: Task }) => (
  <div className="flex items-center justify-between gap-4 py-2 border-b border-border/50 last:border-b-0">
    <span className="font-medium text-sm truncate flex-1">{task.title}</span>
    <div className="flex items-center gap-2 flex-shrink-0">
      <Badge variant="outline" className={cn("text-xs w-16 justify-center", priorityStyles[task.priority])}>{task.priority}</Badge>
      {task.dueDate && (
        <span className="text-xs text-muted-foreground w-24 text-right">
          {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
        </span>
      )}
    </div>
  </div>
);

export default function DashboardPage() {
  const { tasks, isInitialized } = useTasks();
  const [summary, setSummary] = React.useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = React.useState(true);
  const [summaryAudio, setSummaryAudio] = React.useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = React.useState(true);
  const audioRef = React.useRef<HTMLAudioElement>(null);


  const { stats, upcomingTasks, overdueTasksList } = React.useMemo(() => {
    if (!isInitialized) return { stats: null, upcomingTasks: [], overdueTasksList: [] };
    
    const totalTasks = tasks.length;
    const overdueTasks = tasks.filter(task => task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'Done');
    const completedTasksCount = tasks.filter(task => task.status === 'Done').length;
    
    const upcoming = tasks
      .filter(task => task.dueDate && isFuture(new Date(task.dueDate)) && differenceInDays(new Date(task.dueDate), new Date()) <= 7 && task.status !== 'Done')
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
      
    const overdue = overdueTasks.sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

    const calculatedStats = {
      total: totalTasks,
      todo: tasks.filter(t => t.status === 'To Do').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      done: completedTasksCount,
      overdue: overdueTasks.length,
      completionRate: totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0,
    };

    return { stats: calculatedStats, upcomingTasks: upcoming, overdueTasksList: overdue };
  }, [tasks, isInitialized]);
  
  React.useEffect(() => {
    if (stats) {
      setIsGeneratingSummary(true);
      setIsGeneratingAudio(true);
      setSummaryAudio(null);

      const summaryInput = {
        totalTasks: stats.total,
        completedTasks: stats.done,
        overdueTasks: stats.overdue,
        upcomingTasks: upcomingTasks.length,
      };

      generateDashboardSummary(summaryInput).then(result => {
        setSummary(result.summary);
        setIsGeneratingSummary(false);

        // Now generate audio
        generateAudioSummary({ summary: result.summary })
          .then(audioResult => {
            setSummaryAudio(audioResult.media);
          })
          .catch(err => {
            console.error("Failed to generate audio summary:", err);
          })
          .finally(() => {
            setIsGeneratingAudio(false);
          });
      }).catch(err => {
        console.error("Failed to generate summary:", err);
        setSummary("Could not load AI insights. Please ensure your API key is configured correctly.");
        setIsGeneratingSummary(false);
        setIsGeneratingAudio(false);
      });
    }
  }, [stats, upcomingTasks.length]);


  const tasksByStatusData = React.useMemo(() => {
    if (!stats) return [];
    return [
      { status: 'To Do', count: stats.todo },
      { status: 'In Progress', count: stats.inProgress },
      { status: 'Done', count: stats.done },
    ];
  }, [stats]);

  const tasksByPriorityData = React.useMemo(() => {
    if (!isInitialized) return [];
    const high = tasks.filter(t => t.priority === 'High').length;
    const medium = tasks.filter(t => t.priority === 'Medium').length;
    const low = tasks.filter(t => t.priority === 'Low').length;
    return [
      { name: 'High', tasks: high, fill: 'hsl(var(--chart-1))' },
      { name: 'Medium', tasks: medium, fill: 'hsl(var(--chart-4))' },
      { name: 'Low', tasks: low, fill: 'hsl(var(--chart-3))' },
    ];
  }, [tasks, isInitialized]);

  if (!isInitialized || !stats) {
    return (
      <div className="p-4 md:p-6 grid gap-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
         <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 grid gap-6">
      <audio ref={audioRef} src={summaryAudio || undefined} className="hidden" />
      <Card className="col-span-full">
        <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="h-5 w-5 text-primary" />
                AI-Powered Insights
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => audioRef.current?.play()}
                disabled={isGeneratingAudio || !summaryAudio}
                aria-label="Play audio summary"
              >
                {isGeneratingAudio ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Volume2 className="h-5 w-5" />
                )}
              </Button>
            </div>
        </CardHeader>
        <CardContent>
          {isGeneratingSummary ? (
              <Skeleton className="h-6 w-3/4" />
          ) : (
              <p className="text-sm text-foreground">{summary}</p>
          )}
        </CardContent>
      </Card>
      
       <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
               <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
                <ListTodo className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All tasks across your board</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[hsl(var(--chart-2))]/10">
                <Loader2 className="h-5 w-5 text-[hsl(var(--chart-2))]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Tasks being actively worked on</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[hsl(var(--chart-3))]/10">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--chart-3))]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.done}</div>
              <p className="text-xs text-muted-foreground">Tasks marked as done</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground">Tasks past their due date</p>
            </CardContent>
          </Card>
          <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[hsl(var(--chart-5))]/10">
                <Goal className="h-5 w-5 text-[hsl(var(--chart-5))]" />
              </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold mb-2">{stats.completionRate}%</div>
                <Progress value={stats.completionRate} aria-label={`${stats.completionRate}% of tasks completed`} />
            </CardContent>
          </Card>
        </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
            <CardDescription>Distribution of tasks across different statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusChartConfig} className="min-h-[250px] w-full">
                <BarChart data={tasksByStatusData} accessibilityLayer margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="status" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={4} fill="var(--color-To Do)">
                    {tasksByStatusData.map((entry) => (
                        <Bar key={entry.status} dataKey="count" name={entry.status} fill={statusChartConfig[entry.status as keyof typeof statusChartConfig].color} />
                    ))}
                  </Bar>
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
            <CardDescription>Breakdown of tasks by their assigned priority.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
             <ChartContainer config={priorityChartConfig} className="min-h-[250px] w-full">
                <PieChart accessibilityLayer>
                  <ChartTooltip content={<ChartTooltipContent nameKey="tasks" />} />
                  <Pie data={tasksByPriorityData} dataKey="tasks" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return (
                          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }} />
                   <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    Upcoming Deadlines
                  </CardTitle>
                  <CardDescription>Tasks that are due in the next 7 days.</CardDescription>
              </CardHeader>
              <CardContent>
                  {upcomingTasks.length > 0 ? (
                      <div className="space-y-1">
                          {upcomingTasks.map(task => <TaskListItem key={task.id} task={task} />)}
                      </div>
                  ) : (
                      <div className="text-sm text-muted-foreground text-center py-8">
                        <p>No upcoming tasks. Great job!</p>
                      </div>
                  )}
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Overdue Tasks
                  </CardTitle>
                  <CardDescription>These tasks have passed their due date and are not completed.</CardDescription>
              </CardHeader>
              <CardContent>
                  {overdueTasksList.length > 0 ? (
                      <div className="space-y-1">
                           {overdueTasksList.map(task => <TaskListItem key={task.id} task={task} />)}
                      </div>
                  ) : (
                      <div className="text-sm text-muted-foreground text-center py-8">
                        <p>No overdue tasks. Phew!</p>
                      </div>
                  )}
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
