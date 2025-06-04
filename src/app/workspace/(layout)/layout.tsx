import { WorkspaceLayout } from "@/components/workspace/workspace-layout";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <WorkspaceLayout>{children}</WorkspaceLayout>;
}
