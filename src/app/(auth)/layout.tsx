import Image from 'next/image';
import * as React from 'react';
import { KanbanSquare } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
            <div className="relative flex items-center justify-center py-12 lg:py-0">
                 <div className="absolute left-4 top-4 lg:left-8 lg:top-8 flex items-center gap-2 text-lg font-semibold">
                    <KanbanSquare className="h-6 w-6" />
                    <span>TaskFlow</span>
                </div>
                {children}
            </div>
            <div className="hidden bg-muted lg:block relative">
                <Image
                    src="https://images.pexels.com/photos/4065133/pexels-photo-4065133.jpeg"
                    alt="A person focused on their work at a clean desk"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    data-ai-hint="focused work"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <div className="absolute bottom-0 p-10 text-white">
                    <h2 className="text-3xl font-bold">From idea to execution, in one place.</h2>
                    <p className="mt-2 text-lg text-white/80">"The secret of getting ahead is getting started."</p>
                    <p className="mt-4 font-semibold">- Mark Twain</p>
                </div>
            </div>
        </div>
    );
}
