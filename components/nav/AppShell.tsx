import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SideNav } from "@/components/nav/SideNav";
import styles from "./app-shell.module.scss";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className={styles.frame}>
        <SideNav />
        <div className={styles.content}>{children}</div>
      </div>
    </ThemeProvider>
  );
}
