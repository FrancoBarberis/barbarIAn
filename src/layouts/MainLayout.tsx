import {
  layout,
  header,
  body,
  sidebar,
  content,
  footer,
} from "./MainLayout.module.css";

type MainLayoutProps = {
  children: React.ReactNode;
  showSidebar?: boolean;
  title?: string;
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showSidebar = true,
  title = "BarbarIAn",
}) => {
  return (
    <div className={layout}>
      {showSidebar && <aside className={sidebar}>Sidebar</aside>}
      <div className={body}>
        <header className={header}>
          <h1>{title}</h1>
        </header>
        <main className={content}>{children}</main>
        <footer className={footer}>Footer</footer>
      </div>
    </div>
  );
};
